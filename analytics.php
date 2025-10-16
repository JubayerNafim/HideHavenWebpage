<?php
// Simple API for Hide Haven: analytics, orders, reviews, comments, contact + emails
// Deploy this single file to your PHP host (Aeonfree) and call with ?action=...

// CORS & JSON response defaults
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }
header('Content-Type: application/json; charset=utf-8');

// ====== CONFIG ======
// Replace with your actual DB credentials
$host = "sql108.iceiy.com";
$user = "icei_39656021";
$pass = "1wSrhABRpcyX";
$db   = "icei_39656021_hidehaven_analytics";

// Email config (uses PHP mail())
$MAIL_FROM  = "Hide Haven <no-reply@hidehaven.example>"; // change domain if you have one
$ADMIN_EMAIL = "hidehaven.contact@gmail.com";
// Export token for secure read-only endpoints (set a strong value)
$EXPORT_TOKEN = "hh_export_9f2d6c1f0a7b4b9d_72e3!QX"; // set by setup
// Default export start date (YYYY-MM-DD) when none provided in query
$EXPORT_DEFAULT_SINCE = "2025-01-01";

// ====== HELPERS ======
function respond($data, $code = 200) { http_response_code($code); echo json_encode($data); exit(); }
function fail($msg, $code = 400) { respond([ 'ok' => false, 'error' => $msg ], $code); }
function read_json_body() {
	$raw = file_get_contents('php://input');
	if (!$raw) return null;
	$data = json_decode($raw, true);
	return $data ?: null;
}
function send_email($to, $subject, $body, $from) {
	$headers = "MIME-Version: 1.0\r\n" .
						 "Content-type:text/plain; charset=UTF-8\r\n" .
						 "From: {$from}\r\n" .
						 "Reply-To: {$from}\r\n" .
						 "X-Mailer: PHP/" . phpversion();
	// mail() returns bool; swallow failures but report back to caller
	return @mail($to, $subject, $body, $headers);
}
function require_token($token_from_request) {
	global $EXPORT_TOKEN;
	if (!$EXPORT_TOKEN || $EXPORT_TOKEN === 'CHANGE_ME_SET_A_STRONG_TOKEN') {
		// If not configured, block export
		fail('Export token not configured', 401);
	}
	if (!isset($token_from_request) || $token_from_request !== $EXPORT_TOKEN) {
		fail('Unauthorized', 401);
	}
}

// Utility: check if a column exists to adapt to older DB schemas
function column_exists($conn, $dbName, $table, $column) {
	$sql = "SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND COLUMN_NAME=?";
	$stmt = $conn->prepare($sql);
	if (!$stmt) return false;
	$stmt->bind_param("sss", $dbName, $table, $column);
	$stmt->execute();
	$res = $stmt->get_result();
	$row = $res ? $res->fetch_assoc() : null;
	$stmt->close();
	return $row && intval($row['cnt']) > 0;
}

// ====== DB CONNECT ======
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) { fail('Database connection failed', 500); }
$conn->set_charset("utf8mb4");


// ====== ROUTING ======
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;
$body   = $method === 'POST' ? read_json_body() : null;

// Back-compat: if no action and payload looks like analytics, treat as analytics
if (!$action && $method === 'POST' && $body && isset($body['timestamp'], $body['page'])) {
	$action = 'analytics';
}

switch ($action) {
	// ---------- Update Order Status ----------
	case 'order_status_update': {
		if ($method !== 'POST') fail('POST required', 405);
		require_token($_GET['token'] ?? null);
		if (!$body) fail('Invalid JSON');
		$order_id = isset($body['orderId']) ? intval($body['orderId']) : 0;
		$status = isset($body['status']) ? trim($body['status']) : '';
		if ($order_id <= 0 || !$status) fail('Missing orderId or status');
		$allowed = ['pending','confirmed','shipped','delivered','cancelled'];
		if (!in_array(strtolower($status), $allowed)) fail('Invalid status');
		$stmt = $conn->prepare("UPDATE orders SET status=? WHERE id=?");
		if (!$stmt) fail('DB error', 500);
		$stmt->bind_param("si", $status, $order_id);
		$stmt->execute();
		$affected = $stmt->affected_rows;
		$stmt->close();
		respond([ 'ok' => true, 'updated' => $affected ]);
	}
	// ---------- Analytics: track visits and link clicks ----------
	case 'analytics': {
		if ($method !== 'POST') fail('POST required', 405);
		if (!$body) fail('Invalid JSON');
		$timestamp = $body['timestamp'] ?? date('c');
		$page = $body['page'] ?? '';
		$userAgent = $body['userAgent'] ?? '';
		$language = $body['language'] ?? '';
		$country = $body['country'] ?? '';
		$clicked_link = $body['clicked_link'] ?? '';

		$stmt = $conn->prepare("INSERT INTO visits (timestamp, page, userAgent, language, country, clicked_link) VALUES (?, ?, ?, ?, ?, ?)");
		if (!$stmt) fail('DB error', 500);
		$stmt->bind_param("ssssss", $timestamp, $page, $userAgent, $language, $country, $clicked_link);
		$stmt->execute();
		$stmt->close();
		respond([ 'ok' => true ]);
	}

	// ---------- Create Order: save order + items, email admin & customer ----------
	case 'order': {
		if ($method !== 'POST') fail('POST required', 405);
		if (!$body) fail('Invalid JSON');

		// Basic validation
		$name = trim($body['name'] ?? '');
		$email = trim($body['email'] ?? '');
		$phone = trim($body['phone'] ?? '');
		$address = trim($body['address'] ?? '');
		$delivery_area = ($body['deliveryArea'] ?? 'dhaka') === 'outside' ? 'outside' : 'dhaka';
		$note = trim($body['note'] ?? '');
		$items = $body['items'] ?? [];
		if (!$name || !$phone || !$address || !is_array($items) || count($items) === 0) {
			fail('Missing required fields: name, phone, address, items');
		}

		// Compute subtotal and totals server-side
		$subtotal = 0;
		$clean_items = [];
		foreach ($items as $it) {
			$pId = isset($it['productId']) ? intval($it['productId']) : (isset($it['product']['id']) ? intval($it['product']['id']) : null);
			$pName = $it['name'] ?? ($it['product']['name'] ?? '');
			$price = intval($it['price'] ?? ($it['product']['salePrice'] ?? $it['product']['price'] ?? 0));
			$qty = max(1, intval($it['quantity'] ?? 1));
			if ($pName === '' || $price <= 0) continue;
			$subtotal += ($price * $qty);
			$clean_items[] = [ 'product_id' => $pId, 'product_name' => $pName, 'unit_price' => $price, 'quantity' => $qty ];
		}
		if (count($clean_items) === 0) fail('No valid items');
	$delivery_fee = ($delivery_area === 'dhaka') ? 29 : 99;
		$total = $subtotal + $delivery_fee;

		// Insert order
		$status = 'pending';
		$stmt = $conn->prepare("INSERT INTO orders (name, email, phone, address, delivery_area, note, delivery_fee, subtotal, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		if (!$stmt) fail('DB error', 500);
		$stmt->bind_param("ssssssiiis", $name, $email, $phone, $address, $delivery_area, $note, $delivery_fee, $subtotal, $total, $status);
		$stmt->execute();
		$order_id = $stmt->insert_id;
		$stmt->close();

			// Insert items (handle nullable product_id by using two statements)
			foreach ($clean_items as $ci) {
				$pid = $ci['product_id'];
				$pname = $ci['product_name'];
				$uprice = $ci['unit_price'];
				$qty = $ci['quantity'];
				if ($pid === null) {
					$stmtItem = $conn->prepare("INSERT INTO order_items (order_id, product_name, unit_price, quantity) VALUES (?, ?, ?, ?)");
					if (!$stmtItem) fail('DB error', 500);
					$stmtItem->bind_param("isii", $order_id, $pname, $uprice, $qty);
				} else {
					$stmtItem = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity) VALUES (?, ?, ?, ?, ?)");
					if (!$stmtItem) fail('DB error', 500);
					$stmtItem->bind_param("iisii", $order_id, $pid, $pname, $uprice, $qty);
				}
				$stmtItem->execute();
				$stmtItem->close();
			}

		// Emails
		global $MAIL_FROM, $ADMIN_EMAIL;
		$orderLines = [];
		foreach ($clean_items as $ci) { $orderLines[] = "- {$ci['product_name']} x {$ci['quantity']} @ ৳{$ci['unit_price']}"; }
		$summary = "New order #{$order_id}\n" .
							 "Name: {$name}\nPhone: {$phone}\nEmail: {$email}\nAddress: {$address}\nArea: {$delivery_area}\nNote: {$note}\n\n" .
							 implode("\n", $orderLines) . "\n\nSubtotal: ৳{$subtotal}\nDelivery: ৳{$delivery_fee}\nTotal: ৳{$total}";
		@send_email($ADMIN_EMAIL, "New order #{$order_id}", $summary, $MAIL_FROM);
			if ($email) {
				$custMsg = "Hi {$name},\n\nThanks for your order (#{$order_id})! An agent from Hide Haven will call you within 24 hours to confirm.\n\nOrder summary:\n" . implode("\n", $orderLines) . "\n\nTotal: ৳{$total}\n\n— Hide Haven";
			@send_email($email, "Your Hide Haven order #{$order_id}", $custMsg, $MAIL_FROM);
		}

		respond([ 'ok' => true, 'orderId' => $order_id ]);
	}

	// ---------- Add Review ----------
	case 'review_add': {
		if ($method !== 'POST') fail('POST required', 405);
		if (!$body) fail('Invalid JSON');
		$product_id = intval($body['productId'] ?? 0);
		$name = trim($body['name'] ?? '');
		$text = trim($body['text'] ?? '');
		$rating = isset($body['rating']) ? intval($body['rating']) : null;
		if ($product_id <= 0 || !$name || !$text) fail('Missing fields');
		$status = 'approved'; // set to 'pending' if you want moderation
		if ($rating !== null) {
			$stmt = $conn->prepare("INSERT INTO reviews (product_id, name, text, rating, status) VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param("issis", $product_id, $name, $text, $rating, $status);
		} else {
			$stmt = $conn->prepare("INSERT INTO reviews (product_id, name, text, status) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("isss", $product_id, $name, $text, $status);
		}
		$stmt->execute();
		$stmt->close();
		respond([ 'ok' => true ]);
	}

	// ---------- List Reviews (approved only) ----------
	case 'review_list': {
		$product_id = intval($_GET['productId'] ?? 0);
		if ($product_id <= 0) fail('productId required');
		$stmt = $conn->prepare("SELECT id, product_id, name, text, rating, created_at FROM reviews WHERE product_id=? AND status='approved' ORDER BY id DESC LIMIT 200");
		$stmt->bind_param("i", $product_id);
		$stmt->execute();
		$res = $stmt->get_result();
		$rows = [];
		while ($row = $res->fetch_assoc()) { $rows[] = $row; }
		$stmt->close();
		respond([ 'ok' => true, 'reviews' => $rows ]);
	}

	// ---------- Add Comment (general or product-specific) ----------
	case 'comment_add': {
		if ($method !== 'POST') fail('POST required', 405);
		if (!$body) fail('Invalid JSON');
		$product_id = isset($body['productId']) ? intval($body['productId']) : null; // optional
		$name = trim($body['name'] ?? '');
		$text = trim($body['text'] ?? '');
		if (!$name || !$text) fail('Missing fields');
		$status = 'approved';
		if ($product_id === null) {
			$stmt = $conn->prepare("INSERT INTO comments (product_id, name, text, status) VALUES (NULL, ?, ?, ?)");
			$stmt->bind_param("sss", $name, $text, $status);
		} else {
			$stmt = $conn->prepare("INSERT INTO comments (product_id, name, text, status) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("isss", $product_id, $name, $text, $status);
		}
		$stmt->execute();
		$stmt->close();
		respond([ 'ok' => true ]);
	}

	// ---------- List Comments ----------
	case 'comment_list': {
		$product_id = isset($_GET['productId']) ? intval($_GET['productId']) : null;
		if ($product_id === null) {
			$sql = "SELECT id, product_id, name, text, created_at FROM comments WHERE status='approved' ORDER BY id DESC LIMIT 200";
			$res = $conn->query($sql);
		} else {
			$stmt = $conn->prepare("SELECT id, product_id, name, text, created_at FROM comments WHERE status='approved' AND product_id=? ORDER BY id DESC LIMIT 200");
			$stmt->bind_param("i", $product_id);
			$stmt->execute();
			$res = $stmt->get_result();
		}
		$rows = [];
		while ($row = $res->fetch_assoc()) { $rows[] = $row; }
		if (isset($stmt)) $stmt->close();
		respond([ 'ok' => true, 'comments' => $rows ]);
	}

	// ---------- Contact form (optional) ----------
	case 'contact': {
		if ($method !== 'POST') fail('POST required', 405);
		if (!$body) fail('Invalid JSON');
		$name = trim($body['name'] ?? '');
		$email = trim($body['email'] ?? '');
		$phone = trim($body['phone'] ?? '');
		$message = trim($body['message'] ?? '');
		if (!$name || !$message) fail('Missing fields');
		$stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $name, $email, $phone, $message);
		$stmt->execute();
		$stmt->close();
		global $MAIL_FROM, $ADMIN_EMAIL;
		@send_email($ADMIN_EMAIL, "New contact message from {$name}", $message . "\n\nPhone: {$phone}\nEmail: {$email}", $MAIL_FROM);
		respond([ 'ok' => true ]);
	}

	// ---------- Orders Export (for Google Sheets) ----------
	case 'orders_export': {
		if ($method !== 'GET') fail('GET required', 405);
		require_token($_GET['token'] ?? null);
		global $EXPORT_DEFAULT_SINCE;
		$since = $_GET['since'] ?? $EXPORT_DEFAULT_SINCE; // YYYY-MM-DD
			global $db;
			$hasCreatedOrders = column_exists($conn, $db, 'orders', 'created_at');
			// Build columns list conditionally
			$orderCols = "id, name, email, phone, address, delivery_area, note, delivery_fee, subtotal, total, status" . ($hasCreatedOrders ? ", created_at" : "");
			if ($hasCreatedOrders) {
				$sql = "SELECT {$orderCols} FROM orders WHERE DATE(created_at) >= ? ORDER BY id DESC LIMIT 2000";
				$stmt = $conn->prepare($sql);
				$stmt->bind_param("s", $since);
			} else {
				$sql = "SELECT {$orderCols} FROM orders ORDER BY id DESC LIMIT 2000";
				$stmt = $conn->prepare($sql);
			}
		$stmt->execute();
		$res = $stmt->get_result();
		$orders = [];
		$orderIds = [];
		while ($row = $res->fetch_assoc()) { $orders[] = $row; $orderIds[] = intval($row['id']); }
		$stmt->close();
		$itemsByOrder = [];
		if (count($orderIds) > 0) {
			$in = implode(',', array_fill(0, count($orderIds), '?'));
			$types = str_repeat('i', count($orderIds));
				$hasCreatedItems = column_exists($conn, $db, 'order_items', 'created_at');
				$itemCols = "order_id, product_id, product_name, unit_price, quantity" . ($hasCreatedItems ? ", created_at" : "");
				$q = $conn->prepare("SELECT {$itemCols} FROM order_items WHERE order_id IN ($in)");
			$q->bind_param($types, ...$orderIds);
			$q->execute();
			$ri = $q->get_result();
			while ($r = $ri->fetch_assoc()) { $oid = intval($r['order_id']); if (!isset($itemsByOrder[$oid])) $itemsByOrder[$oid] = []; $itemsByOrder[$oid][] = $r; }
			$q->close();
		}
		foreach ($orders as &$o) { $oid = intval($o['id']); $o['items'] = $itemsByOrder[$oid] ?? []; }
		respond([ 'ok' => true, 'orders' => $orders ]);
	}

	// ---------- Visits Export (for Google Sheets) ----------
	case 'visits_export': {
		if ($method !== 'GET') fail('GET required', 405);
		require_token($_GET['token'] ?? null);
		global $EXPORT_DEFAULT_SINCE;
		$since = $_GET['since'] ?? $EXPORT_DEFAULT_SINCE; // YYYY-MM-DD
			// Be robust to schemas without created_at; if missing, filter using timestamp string
			global $db;
			$hasCreated = column_exists($conn, $db, 'visits', 'created_at');
			if ($hasCreated) {
				$stmt = $conn->prepare("SELECT id, `timestamp`, page, userAgent, `language`, country, clicked_link, created_at FROM visits WHERE DATE(created_at) >= ? ORDER BY id DESC LIMIT 5000");
				$stmt->bind_param("s", $since);
			} else {
				// LEFT(timestamp,10) works for ISO-8601 strings like 2025-09-16T...
				$stmt = $conn->prepare("SELECT id, `timestamp`, page, userAgent, `language`, country, clicked_link FROM visits WHERE LEFT(`timestamp`,10) >= ? ORDER BY id DESC LIMIT 5000");
				$stmt->bind_param("s", $since);
			}
		$stmt->execute();
		$res = $stmt->get_result();
		$rows = [];
		while ($row = $res->fetch_assoc()) { $rows[] = $row; }
		$stmt->close();
		respond([ 'ok' => true, 'visits' => $rows ]);
	}

	// ---------- Contacts Export (for Google Sheets) ----------
	case 'contacts_export': {
		if ($method !== 'GET') fail('GET required', 405);
		require_token($_GET['token'] ?? null);
		global $EXPORT_DEFAULT_SINCE;
		$since = $_GET['since'] ?? $EXPORT_DEFAULT_SINCE; // YYYY-MM-DD
			global $db;
			$hasCreatedContacts = column_exists($conn, $db, 'contacts', 'created_at');
			$contactCols = "id, name, email, phone, message" . ($hasCreatedContacts ? ", created_at" : "");
			if ($hasCreatedContacts) {
				$stmt = $conn->prepare("SELECT {$contactCols} FROM contacts WHERE DATE(created_at) >= ? ORDER BY id DESC LIMIT 2000");
				$stmt->bind_param("s", $since);
			} else {
				$stmt = $conn->prepare("SELECT {$contactCols} FROM contacts ORDER BY id DESC LIMIT 2000");
			}
		$stmt->execute();
		$res = $stmt->get_result();
		$rows = [];
		while ($row = $res->fetch_assoc()) { $rows[] = $row; }
		$stmt->close();
		respond([ 'ok' => true, 'contacts' => $rows ]);
	}

	// ---------- Order Items Export (for Google Sheets) ----------
	case 'order_items_export': {
		if ($method !== 'GET') fail('GET required', 405);
		require_token($_GET['token'] ?? null);
		global $EXPORT_DEFAULT_SINCE;
		$since = $_GET['since'] ?? $EXPORT_DEFAULT_SINCE; // YYYY-MM-DD
		global $db;
		$hasItemCreated = column_exists($conn, $db, 'order_items', 'created_at');
		$hasOrderCreated = column_exists($conn, $db, 'orders', 'created_at');
		// Build SELECT and WHERE based on available timestamps
		if ($hasItemCreated) {
			$sql = "SELECT oi.order_id, oi.product_id, oi.product_name, oi.unit_price, oi.quantity, oi.created_at FROM order_items oi WHERE DATE(oi.created_at) >= ? ORDER BY oi.order_id DESC, oi.product_name ASC LIMIT 5000";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param("s", $since);
		} else if ($hasOrderCreated) {
			$sql = "SELECT oi.order_id, oi.product_id, oi.product_name, oi.unit_price, oi.quantity, o.created_at AS order_created_at FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE DATE(o.created_at) >= ? ORDER BY oi.order_id DESC, oi.product_name ASC LIMIT 5000";
			$stmt = $conn->prepare($sql);
			$stmt->bind_param("s", $since);
		} else {
			// No timestamps available: return latest items without date filter
			$sql = "SELECT oi.order_id, oi.product_id, oi.product_name, oi.unit_price, oi.quantity FROM order_items oi ORDER BY oi.order_id DESC, oi.product_name ASC LIMIT 5000";
			$stmt = $conn->prepare($sql);
		}
		$stmt->execute();
		$res = $stmt->get_result();
		$rows = [];
		while ($row = $res->fetch_assoc()) { $rows[] = $row; }
		$stmt->close();
		respond([ 'ok' => true, 'order_items' => $rows ]);
	}

	// ---------- Default / unknown ----------
	default:
		fail('Unknown action', 404);
}

?>