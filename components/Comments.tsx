import React, { useEffect, useState } from 'react';
import { API_ENDPOINT } from '../constants';

interface CommentItem { id?: number; name: string; text: string; created_at?: string }

const Comments: React.FC<{ productId?: number }>
= ({ productId }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');

  // Fetch approved comments
  useEffect(() => {
    const run = async () => {
      try {
        const url = productId
          ? `${API_ENDPOINT}?action=comment_list&productId=${productId}`
          : `${API_ENDPOINT}?action=comment_list`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.comments)) setComments(data.comments);
      } catch {}
    };
    run();
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setStatus('sending');
    // optimistic update
    const optimistic = { name, text, created_at: new Date().toISOString() };
    setComments(prev => [optimistic as CommentItem, ...prev]);
    try {
      await fetch(`${API_ENDPOINT}?action=comment_add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, text }),
      });
    } catch {}
    setName('');
    setText('');
    setStatus('idle');
  };

  return (
    <div className="mt-6">
      <h4 className="font-bold text-chocolate mb-2">Comments</h4>
      <form onSubmit={submit} className="space-y-2 mb-3">
        <input
          className="w-full border rounded px-2 py-1 text-xs"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded px-2 py-1 text-xs"
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={2}
          required
        />
        <button disabled={status==='sending'} className="bg-chocolate text-cream px-3 py-1 rounded text-xs font-bold" type="submit">
          {status==='sending' ? 'Sending...' : 'Post Comment'}
        </button>
      </form>
      <ul className="space-y-2 max-h-40 overflow-auto pr-1">
        {comments.map((c, i) => (
          <li key={i} className="bg-chocolate/5 rounded p-2 text-xs">
            <span className="font-semibold text-chocolate">{c.name}:</span> {c.text}
          </li>
        ))}
        {comments.length === 0 && (
          <li className="text-xs text-chocolate-light">No comments yet. Be the first to comment.</li>
        )}
      </ul>
    </div>
  );
};

export default Comments;
