import React, { useEffect, useState } from 'react';
import { Trash2, GraduationCap, Plus } from 'lucide-react';
import { fetchAPI } from '../api';

export default function ManageResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [semester, setSemester] = useState('1st');
  const [shift, setShift] = useState('');
  const [group, setGroup] = useState('');

  const loadResults = async () => {
    try {
      const data = await fetchAPI('/exam/results');
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadResults(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetchAPI('/exam/results', {
        method: 'POST',
        body: JSON.stringify({ title, fileUrl, department, semester, shift, group }),
      });
      setTitle(''); setFileUrl(''); setShift(''); setGroup('');
      loadResults();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await fetchAPI(`/exam/results/${id}`, { method: 'DELETE' });
      loadResults();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
      
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} color="var(--primary-color)" /> Post New Result
        </h3>
        {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Title</label>
            <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Midterm Results Fall 2026" />
          </div>
          <div className="input-group">
            <label>Department</label>
            <select className="input-field" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="CSE">Computer Science</option>
              <option value="EEE">Electrical</option>
              <option value="CIVIL">Civil</option>
              <option value="MECH">Mechanical</option>
            </select>
          </div>
          <div className="input-group">
            <label>Semester</label>
            <select className="input-field" value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
              <option value="3rd">3rd Semester</option>
              <option value="4th">4th Semester</option>
              <option value="5th">5th Semester</option>
              <option value="6th">6th Semester</option>
              <option value="7th">7th Semester</option>
              <option value="8th">8th Semester</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Shift (Optional)</label>
              <input className="input-field" value={shift} onChange={e => setShift(e.target.value)} placeholder="1st / 2nd" />
            </div>
            <div className="input-group">
              <label>Group (Optional)</label>
              <input className="input-field" value={group} onChange={e => setGroup(e.target.value)} placeholder="A / B" />
            </div>
          </div>
          <div className="input-group">
            <label>Attachment URL (Image/PDF)</label>
            <input className="input-field" type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} required placeholder="https://example.com/file.pdf" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Publish Result</button>
        </form>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Published Results</h3>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <GraduationCap size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto' }} />
            <p>No results have been published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.map(s => (
              <div key={s.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: '8px' }}>
                  <GraduationCap size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{s.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>
                    {s.department} • {s.semester} Semester 
                    {s.shift && ` • Shift ${s.shift}`} 
                    {s.group && ` • Group ${s.group}`}
                  </p>
                  <a href={s.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    View Result File
                  </a>
                </div>
                <button className="action-btn delete" onClick={() => handleDelete(s.id)} title="Delete Result">
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
