import React, { useEffect, useState } from 'react';
import { Trash2, FileText, Plus } from 'lucide-react';
import { fetchAPI } from '../api';

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const loadNotices = async () => {
    try {
      const data = await fetchAPI('/admin/notices');
      setNotices(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadNotices(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI('/admin/notices', {
        method: 'POST',
        body: JSON.stringify({ title, content, fileUrl: fileUrl || null }),
      });
      setTitle(''); setContent(''); setFileUrl('');
      loadNotices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await fetchAPI(`/admin/notices/${id}`, { method: 'DELETE' });
      loadNotices();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
      
      {/* Create Notice Form */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} color="var(--primary-color)" /> Post New Notice
        </h3>
        {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Notice Title</label>
            <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Exam Schedule Fall 2026" />
          </div>
          <div className="input-group">
            <label>Content Description</label>
            <textarea className="input-field" rows="4" value={content} onChange={e => setContent(e.target.value)} required placeholder="Details about the notice..." style={{ resize: 'vertical' }}></textarea>
          </div>
          <div className="input-group">
            <label>Attachment URL (Optional)</label>
            <input className="input-field" type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://example.com/file.pdf" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Publish Notice</button>
        </form>
      </div>

      {/* Notice List */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Published Notices</h3>
        {notices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto' }} />
            <p>No notices have been published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notices.map(n => (
              <div key={n.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--info-bg)', color: 'var(--info-color)', borderRadius: '8px' }}>
                  <FileText size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{n.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginBottom: n.fileUrl ? '12px' : '0' }}>{n.content}</p>
                  {n.fileUrl && (
                    <a href={n.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--info-color)', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      View Attachment
                    </a>
                  )}
                </div>
                <button className="action-btn delete" onClick={() => handleDelete(n.id)} title="Delete Notice">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
