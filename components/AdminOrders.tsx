

import React, { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../constants';

// Export token for secure endpoints (must match backend)
const EXPORT_TOKEN = 'hh_export_9f2d6c1f0a7b4b9d_72e3!QX';

const statusOptions = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];


const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const url = `${API_ENDPOINT}?action=orders_export&token=${encodeURIComponent(EXPORT_TOKEN)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Failed to fetch orders');
        // Normalize status to Title Case for UI
        const orders = (data.orders || []).map(o => ({
          ...o,
          status: o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : '',
          createdAt: o.created_at || o.createdAt || '',
          items: o.items || [],
        }));
        setOrders(orders);
      } catch (e) {
        setError(e.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders by name, phone, or address
  const filteredOrders = orders.filter(order => {
    const matchText =
      (order.name || '').toLowerCase().includes(filter.toLowerCase()) ||
      (order.phone || '').includes(filter) ||
      (order.address || '').toLowerCase().includes(filter.toLowerCase());
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    return matchText && matchStatus;
  });

  // Update order status in backend
  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistically update UI
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    try {
      const url = `${API_ENDPOINT}?action=order_status_update&token=${encodeURIComponent(EXPORT_TOKEN)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus.toLowerCase() })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to update status');
    } catch (e) {
      setError(e.message || 'Failed to update status');
      // Revert UI if failed
      setOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, status: orders.find(o => o.id === orderId)?.status || '' } : order
        )
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {newOrderAlert && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded shadow">
          <strong>New order received!</strong> Refresh to see the latest orders.
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-chocolate">Admin Dashboard: Orders</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, address..."
          className="border rounded px-3 py-2 flex-1"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center text-chocolate mt-8">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-red-600 mt-8">{error}</div>
      ) : (
        <>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-chocolate text-cream">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Address</th>
                <th className="p-2">Items</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="p-2 font-mono">{order.id}</td>
                  <td className="p-2">{order.name}</td>
                  <td className="p-2">{order.phone}</td>
                  <td className="p-2">{order.address}</td>
                  <td className="p-2">
                    <ul>
                      {(order.items || []).map((item, idx) => (
                        <li key={idx}>{item.product_name} x{item.quantity} (৳{item.unit_price})</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center text-chocolate-light mt-8">No orders found.</div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
