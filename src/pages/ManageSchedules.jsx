import React, { useEffect, useState } from 'react';
import { Trash2, Calendar, Plus, Clock, BookOpen, MapPin } from 'lucide-react';
import { fetchAPI } from '../api';

export default function ManageSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [type, setType] = useState('EXAM');
  const [department, setDepartment] = useState('CSE');
  const [semester, setSemester] = useState('1st');
  const [shift, setShift] = useState('');
  const [group, setGroup] = useState('');

  const loadSchedules = async () => {
    try {
      const data = await fetchAPI('/exam/schedules');
      setSchedules(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadSchedules(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await fetchAPI('/exam/schedules', {
        method: 'POST',
        body: JSON.stringify({ title, subject, date, startTime, endTime, room, type, department, semester, shift, group }),
      });
      setTitle(''); setSubject(''); setDate(''); setStartTime(''); setEndTime(''); setRoom(''); setShift(''); setGroup('');
      setSuccess('Schedule created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadSchedules();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule entry?')) return;
    try {
      await fetchAPI(`/exam/schedules/${id}`, { method: 'DELETE' });
      loadSchedules();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const typeColors = {
    EXAM: { bg: '#fef2f2', color: '#dc2626', label: 'Exam' },
    CLASS: { bg: '#eff6ff', color: '#2563eb', label: 'Class' },
    LAB: { bg: '#f0fdf4', color: '#16a34a', label: 'Lab' },
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>

      {/* Create Form */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} color="var(--primary-color)" /> Create Schedule Entry
        </h3>
        {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {success && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{success}</div>}
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Schedule Title</label>
            <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Midterm Exam Schedule Fall 2026" />
          </div>
          <div className="input-group">
            <label>Subject Name</label>
            <input className="input-field" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g. Data Structures & Algorithms" />
          </div>
          <div className="input-group">
            <label>Type</label>
            <select className="input-field" value={type} onChange={e => setType(e.target.value)}>
              <option value="EXAM">Exam</option>
              <option value="CLASS">Class</option>
              <option value="LAB">Lab</option>
            </select>
          </div>
          <div className="input-group">
            <label>Date</label>
            <input className="input-field" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label>Start Time</label>
              <input className="input-field" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>End Time</label>
              <input className="input-field" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label>Room (Optional)</label>
            <input className="input-field" value={room} onChange={e => setRoom(e.target.value)} placeholder="e.g. Room 301" />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />
          <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Target Audience</p>

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
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Publish Schedule</button>
        </form>
      </div>

      {/* Schedule List */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Published Schedules</h3>
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto' }} />
            <p>No schedules have been published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {schedules.map(s => {
              const tc = typeColors[s.type] || typeColors.EXAM;
              return (
                <div key={s.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', gap: '16px', alignItems: 'flex-start', borderLeft: `4px solid ${tc.color}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: tc.bg, color: tc.color, textTransform: 'uppercase' }}>{tc.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.department} • {s.semester} Sem{s.shift ? ` • ${s.shift} Shift` : ''}{s.group ? ` • Group ${s.group}` : ''}</span>
                    </div>
                    <h4 style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px', color: 'var(--text-main)' }}>{s.title}</h4>
                    <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px', color: 'var(--text-main)' }}>
                      <BookOpen size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px', opacity: 0.5 }} />
                      {s.subject}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {formatDate(s.date)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {s.startTime} – {s.endTime}
                      </span>
                      {s.room && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} /> {s.room}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="action-btn delete" onClick={() => handleDelete(s.id)} title="Delete Schedule">
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
