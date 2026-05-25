import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { fetchAPI } from '../api';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = async () => {
    try {
      const data = await fetchAPI('/admin/announcements');
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await fetchAPI(`/announcements/${id}`, { method: 'DELETE' });
      loadAnnouncements();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>System Announcements</h2>
      </div>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '16px' }}>{error}</div>}

      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}><div className="loader" style={{ borderColor: 'var(--primary-color)' }}></div></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Author</th>
                <th>Target</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: '600', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{a.content}</td>
                  <td>{a.author.name}</td>
                  <td>
                    <span className={`badge badge-${a.target.toLowerCase() === 'all' ? 'all' : a.target.toLowerCase()}`}>
                      {a.target}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => deleteAnnouncement(a.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {announcements.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No announcements found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
