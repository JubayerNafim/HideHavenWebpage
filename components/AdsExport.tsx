import React, { useMemo, useState } from 'react';
import { PRODUCTS, LOGO_URL } from '../constants';
import { PRODUCT_IMAGES } from '../assets';

const currency = 'BDT';

function toAbsolute(url: string) {
  try {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = window.location.origin + (import.meta.env.BASE_URL || '/');
    // PRODUCT_IMAGES already includes BASE at start; avoid duplicating BASE
    return url.startsWith(import.meta.env.BASE_URL || '/')
      ? window.location.origin + url
      : new URL(url, base).toString();
  } catch {
    return url;
  }
}

function download(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const AdsExport: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [campaign, setCampaign] = useState('hidehaven_facebook_ads');
  const [landing, setLanding] = useState<string>(() => window.location.origin + window.location.pathname + '#/products');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
  }, [search]);

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const buildLink = (productId: number) => {
    // Ensure landing is base URL (with or without trailing slash)
    let base = landing;
    // Remove any hash or query from landing
    base = base.replace(/[#?].*$/, '');
    // Compose hash route with product and UTM params
    const params = new URLSearchParams();
    params.set('product', String(productId));
    params.set('utm_source', 'facebook');
    params.set('utm_medium', 'cpc');
    params.set('utm_campaign', campaign || 'hidehaven');
    return `${base}#/products?${params.toString()}`;
  };

  const handleDownloadCSV = () => {
    const header = [
      'id','title','description','availability','condition','price','link','image_link','brand','sale_price'
    ];
    const rows = PRODUCTS
      .filter(p => selected.includes(p.id))
      .map(p => {
        const price = (p.salePrice ?? p.price).toFixed(0) + ' ' + currency;
        const salePrice = p.onSale && p.salePrice ? p.salePrice.toFixed(0) + ' ' + currency : '';
        const img = PRODUCT_IMAGES[p.id] ? toAbsolute(PRODUCT_IMAGES[p.id]) : toAbsolute(LOGO_URL);
        const desc = 'Premium quality leather product from Hide Haven.';
        return [
          p.id,
          p.name,
          desc,
          p.stock ? 'in stock' : 'out of stock',
          'new',
          price,
          buildLink(p.id),
          img,
          'Hide Haven',
          salePrice,
        ];
      });
    const csv = [header, ...rows]
      .map(cols => cols.map(v => {
        const s = String(v ?? '');
        // Escape quotes and wrap
        return '"' + s.replace(/"/g, '""') + '"';
      }).join(','))
      .join('\n');
    download('hidehaven_facebook_catalog.csv', csv);
  };

  const adTexts = useMemo(() => {
    return PRODUCTS.filter(p => selected.includes(p.id)).map(p => {
      const price = (p.salePrice ?? p.price).toFixed(0);
      return `Introducing ${p.name} — premium leather quality. Now only ৳${price}.\nOrder now: ${buildLink(p.id)}`;
    }).join('\n\n');
  }, [selected, campaign, landing]);

  const allSelected = selected.length && selected.length === filtered.length;

  return (
  <div className="max-w-4xl mx-auto bg-cream min-h-screen py-8">
      <h1 className="text-2xl font-bold text-chocolate mb-4">Facebook Ads Export</h1>
      <p className="text-sm text-chocolate-light mb-4">Select products and export a CSV for Facebook Catalog, plus ready-to-use ad text with UTM links.</p>

      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <label className="text-sm">Campaign name
          <input className="w-full border rounded px-3 py-2 mt-1" value={campaign} onChange={e => setCampaign(e.target.value)} />
        </label>
        <label className="text-sm">Landing URL
          <input className="w-full border rounded px-3 py-2 mt-1" value={landing} onChange={e => setLanding(e.target.value)} />
        </label>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 border rounded px-3 py-2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="px-3 py-2 border rounded"
          onClick={() => setSelected(filtered.map(p => p.id))}
        >Select visible</button>
        <button
          className="px-3 py-2 border rounded"
          onClick={() => setSelected([])}
        >Clear</button>
      </div>

      <div className="border rounded divide-y">
        <div className="px-3 py-2 flex items-center gap-3 bg-chocolate/5">
          <input type="checkbox" checked={!!allSelected} onChange={(e) => {
            setSelected(e.target.checked ? filtered.map(p => p.id) : []);
          }} />
          <span className="font-semibold text-sm">Select all visible ({filtered.length})</span>
        </div>
        {filtered.map(p => (
          <label key={p.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer">
            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
            <img src={PRODUCT_IMAGES[p.id]} alt={p.name} className="w-12 h-12 object-cover rounded border" />
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-chocolate-light">৳{(p.salePrice ?? p.price)} {p.onSale ? '(on sale)' : ''}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          className="bg-chocolate text-cream px-4 py-2 rounded hover:bg-chocolate-light disabled:opacity-50"
          disabled={!selected.length}
          onClick={handleDownloadCSV}
        >Download Facebook CSV</button>

        <button
          className="border px-4 py-2 rounded"
          disabled={!selected.length}
          onClick={() => {
            navigator.clipboard.writeText(adTexts);
            alert('Ad texts copied to clipboard');
          }}
        >Copy Ad Texts</button>
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold">Preview / Edit Ad Text</label>
        <textarea className="w-full border rounded px-3 py-2 mt-1 h-40" value={adTexts} onChange={() => {}} readOnly />
      </div>
    </div>
  );
};

export default AdsExport;
