import React, { useEffect, useState } from 'react';
import { Trash2, ClipboardList, Plus, Grid3x3, Users, Settings2, Info, UserPlus, Monitor } from 'lucide-react';
import { fetchAPI } from '../api';

export default function ManageExamSeats() {
  const [examSeats, setExamSeats] = useState([]);
  const [error, setError] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [semester, setSemester] = useState('1st');
  const [shift, setShift] = useState('');
  const [group, setGroup] = useState('');
  
  // Grid Builder State
  const [rows, setRows] = useState(6);
  const [columns, setColumns] = useState(4);
  const [grid, setGrid] = useState(Array(6).fill().map(() => Array(4).fill('')));
  const [disabledSeats, setDisabledSeats] = useState(new Set()); // e.g. "0-2"

  // Auto Fill State
  const [seriesList, setSeriesList] = useState([{ id: Date.now(), department: 'CSE', semester: '1st', shift: '', group: '', fetchedRolls: [], isFetching: false }]);
  const [fillMode, setFillMode] = useState('columns'); // 'columns', 'rows', 'snake-cols', 'snake-rows'

  const loadExamSeats = async () => {
    try {
      const data = await fetchAPI('/exam/exam-seats');
      setExamSeats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadExamSeats(); }, []);

  // Update grid size when rows/cols change
  useEffect(() => {
    setGrid(prevGrid => {
      const newGrid = Array(rows).fill().map(() => Array(columns).fill(''));
      for (let r = 0; r < Math.min(rows, prevGrid.length); r++) {
        for (let c = 0; c < Math.min(columns, prevGrid[r].length); c++) {
          newGrid[r][c] = prevGrid[r][c];
        }
      }
      return newGrid;
    });
    
    setDisabledSeats(prev => {
      const newSet = new Set(prev);
      for (let item of newSet) {
        const [r, c] = item.split('-').map(Number);
        if (r >= rows || c >= columns) newSet.delete(item);
      }
      return newSet;
    });
  }, [rows, columns]);

  const handleCellChange = (r, c, value) => {
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = value;
    setGrid(newGrid);
  };

  const toggleSeatDisabled = (r, c) => {
    const key = `${r}-${c}`;
    setDisabledSeats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else {
        newSet.add(key);
        // Clear value if disabling
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        newGrid[r][c] = '';
        setGrid(newGrid);
      }
      return newSet;
    });
  };

  const calculateGeneratedCount = () => {
    return seriesList.reduce((acc, s) => acc + (s.fetchedRolls?.length || 0), 0);
  };

  const generatedCount = calculateGeneratedCount();
  const activeSeatsCount = (rows * columns) - disabledSeats.size;

  const fetchRolls = async (id) => {
    const series = seriesList.find(s => s.id === id);
    if (!series) return;
    
    updateSeries(id, 'isFetching', true);
    try {
      const q = new URLSearchParams();
      if (series.department) q.append('department', series.department);
      if (series.semester) q.append('semester', series.semester);
      if (series.shift) q.append('shift', series.shift);
      if (series.group) q.append('group', series.group);

      const rolls = await fetchAPI(`/exam/students?${q.toString()}`);
      updateSeries(id, 'fetchedRolls', rolls);
    } catch (err) {
      alert('Failed to fetch students: ' + err.message);
    } finally {
      updateSeries(id, 'isFetching', false);
    }
  };

  const handleAutoFill = () => {
    // Generate lists directly from fetched rolls
    const lists = seriesList.map(s => s.fetchedRolls || []);

    // Interleave in pairs (Group 1 & 2, then Group 3 & 4)
    const merged = [];
    for (let p = 0; p < lists.length; p += 2) {
      const listA = lists[p];
      const listB = (p + 1 < lists.length) ? lists[p + 1] : [];
      
      let idx = 0;
      while (idx < listA.length || idx < listB.length) {
        if (idx < listA.length) merged.push(listA[idx]);
        if (idx < listB.length) merged.push(listB[idx]);
        idx++;
      }
    }

    const newGrid = Array(rows).fill().map(() => Array(columns).fill(''));
    let mIdx = 0;
    
    const fillCell = (r, c) => {
      if (!disabledSeats.has(`${r}-${c}`) && mIdx < merged.length) {
        newGrid[r][c] = merged[mIdx++];
      }
    };

    if (fillMode === 'rows') {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) fillCell(r, c);
      }
    } else if (fillMode === 'snake-rows') {
      for (let r = 0; r < rows; r++) {
        if (r % 2 === 0) {
          for (let c = 0; c < columns; c++) fillCell(r, c);
        } else {
          for (let c = columns - 1; c >= 0; c--) fillCell(r, c);
        }
      }
    } else if (fillMode === 'columns') {
      for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) fillCell(r, c);
      }
    } else if (fillMode === 'snake-cols') {
      for (let c = 0; c < columns; c++) {
        if (c % 2 === 0) {
          for (let r = 0; r < rows; r++) fillCell(r, c);
        } else {
          for (let r = rows - 1; r >= 0; r--) fillCell(r, c);
        }
      }
    }
    
    setGrid(newGrid);
  };

  const addSeries = () => setSeriesList([...seriesList, { id: Date.now(), department: 'CSE', semester: '1st', shift: '', group: '', fetchedRolls: [], isFetching: false }]);
  const removeSeries = (id) => setSeriesList(seriesList.filter(s => s.id !== id));
  const updateSeries = (id, field, value) => setSeriesList(seriesList.map(s => s.id === id ? { ...s, [field]: value } : s));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (activeSeatsCount < generatedCount) {
      if (!window.confirm(`Warning: You have ${generatedCount} students but only ${activeSeatsCount} active seats! Some students will not be assigned a seat. Do you want to proceed?`)) {
        return;
      }
    }

    try {
      const finalGrid = grid.map((row, r) => 
        row.map((cell, c) => disabledSeats.has(`${r}-${c}`) ? '[X]' : cell)
      );

      await fetchAPI('/exam/exam-seats', {
        method: 'POST',
        body: JSON.stringify({ 
          title, fileUrl, department, semester, shift, group,
          rows, columns,
          layoutJson: JSON.stringify(finalGrid)
        }),
      });
      
      setTitle(''); setFileUrl(''); setShift(''); setGroup('');
      setRows(6); setColumns(4); setDisabledSeats(new Set()); setGrid(Array(6).fill().map(() => Array(4).fill('')));
      setSeriesList([{ id: Date.now(), department: 'CSE', semester: '1st', shift: '', group: '', fetchedRolls: [], isFetching: false }]);
      loadExamSeats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam seat plan?')) return;
    try {
      await fetchAPI(`/exam/exam-seats/${id}`, { method: 'DELETE' });
      loadExamSeats();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Side: Setup & Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings2 size={20} color="var(--primary-color)" /> Exam Details
            </h3>
            {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <div className="input-group">
              <label>Exam Title</label>
              <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Midterm Seat Plan Fall 2026" />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label>Shift</label>
                <input className="input-field" value={shift} onChange={e => setShift(e.target.value)} placeholder="e.g. 1st Shift" />
              </div>
              <div className="input-group">
                <label>Group</label>
                <input className="input-field" value={group} onChange={e => setGroup(e.target.value)} placeholder="e.g. A" />
              </div>
            </div>
            <div className="input-group">
              <label>Fallback Attachment URL (Optional)</label>
              <input className="input-field" type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://example.com/file.pdf" />
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="var(--info-color)" /> Student Allocation
              </h3>
              <button type="button" onClick={addSeries} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserPlus size={14} /> Add Group
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {seriesList.map((series, idx) => (
                <div key={series.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: 'var(--neutral-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dept</label>
                      <select className="input-field" value={series.department} onChange={e => updateSeries(series.id, 'department', e.target.value)} style={{ padding: '6px', fontSize: '12px' }}>
                        <option value="CSE">CSE</option>
                        <option value="EEE">EEE</option>
                        <option value="CIVIL">CIVIL</option>
                        <option value="MECH">MECH</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sem</label>
                      <select className="input-field" value={series.semester} onChange={e => updateSeries(series.id, 'semester', e.target.value)} style={{ padding: '6px', fontSize: '12px' }}>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                        <option value="3rd">3rd</option>
                        <option value="4th">4th</option>
                        <option value="5th">5th</option>
                        <option value="6th">6th</option>
                        <option value="7th">7th</option>
                        <option value="8th">8th</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shift (Opt)</label>
                      <input className="input-field" value={series.shift} onChange={e => updateSeries(series.id, 'shift', e.target.value)} placeholder="All" style={{ padding: '6px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Grp (Opt)</label>
                      <input className="input-field" value={series.group} onChange={e => updateSeries(series.id, 'group', e.target.value)} placeholder="All" style={{ padding: '6px', fontSize: '12px' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: series.fetchedRolls?.length > 0 ? 'var(--success-color)' : 'var(--text-muted)' }}>
                      {series.fetchedRolls?.length || 0} active students
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => fetchRolls(series.id)} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }} disabled={series.isFetching}>
                        {series.isFetching ? 'Fetching...' : 'Fetch Students'}
                      </button>
                      {seriesList.length > 1 && (
                        <button type="button" onClick={() => removeSeries(series.id)} style={{ padding: '4px 8px', background: 'var(--danger-bg)', color: 'var(--danger-color)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: 'var(--primary-50)', borderRadius: '8px', border: '1px solid var(--primary-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>Algorithm Strategy</span>
                <select className="input-field" style={{ width: '180px', padding: '6px 12px', fontSize: '13px' }} value={fillMode} onChange={e => setFillMode(e.target.value)}>
                  <option value="columns">Fill by Columns (Front to Back)</option>
                  <option value="snake-cols">Snake by Columns</option>
                  <option value="rows">Fill by Rows (Left to Right)</option>
                  <option value="snake-rows">Snake by Rows</option>
                </select>
              </div>
              <button type="button" onClick={handleAutoFill} className="btn-primary" style={{ width: '100%' }}>
                Allocate Students to Seats
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: The Interactive Classroom Builder */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Grid3x3 size={20} color="var(--warning-color)" /> Classroom Layout
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Rows</label>
                <input type="number" min="1" max="25" value={rows} onChange={e => setRows(parseInt(e.target.value) || 1)} className="input-field" style={{ width: '60px', padding: '6px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Cols</label>
                <input type="number" min="1" max="15" value={columns} onChange={e => setColumns(parseInt(e.target.value) || 1)} className="input-field" style={{ width: '60px', padding: '6px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '12px 16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary-color)' }}></div> Active: <b>{activeSeatsCount}</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '1px dashed var(--text-muted)' }}></div> Empty: <b>{disabledSeats.size}</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} color="var(--info-color)"/> Students: <b style={{ color: generatedCount > activeSeatsCount ? 'var(--danger-color)' : 'inherit'}}>{generatedCount}</b></div>
          </div>

          <div style={{ flex: 1, backgroundColor: 'var(--neutral-50)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', overflowX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Whiteboard Indicator */}
            <div style={{ width: '60%', minWidth: '200px', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>FRONT OF CLASS (WHITEBOARD)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <Monitor size={24} color="var(--text-muted)" style={{ opacity: 0.5 }} />
            </div>

            {/* The Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))`, 
              gap: '12px',
              width: '100%'
            }}>
              {grid.map((row, r) => 
                row.map((cell, c) => {
                  const isDisabled = disabledSeats.has(`${r}-${c}`);
                  return (
                    <div 
                      key={`${r}-${c}`} 
                      onClick={() => toggleSeatDisabled(r, c)}
                      style={{ 
                        aspectRatio: '2/1.2',
                        backgroundColor: isDisabled ? 'transparent' : 'white',
                        border: isDisabled ? '2px dashed #cbd5e1' : '2px solid var(--primary-color)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        boxShadow: isDisabled ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
                        opacity: isDisabled ? 0.6 : 1
                      }}
                      title={isDisabled ? "Click to add desk" : "Click to remove desk"}
                    >
                      {!isDisabled ? (
                        <input
                          value={cell}
                          onChange={(e) => handleCellChange(r, c, e.target.value)}
                          onClick={(e) => e.stopPropagation()} // prevent toggling when typing
                          placeholder={`Seat`}
                          style={{
                            width: '90%',
                            textAlign: 'center',
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            backgroundColor: 'transparent'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>Empty</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            <p style={{ marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} /> Tip: Click on any desk to remove it (creates an aisle or empty space).
            </p>
          </div>

          <button type="button" onClick={handleCreate} className="btn-primary" style={{ marginTop: '24px', padding: '16px', fontSize: '16px', backgroundColor: 'var(--success-color)' }}>
            Publish Classroom Plan
          </button>
        </div>
      </div>

      {/* Bottom: Published Seats List */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Previously Published Plans</h3>
        {examSeats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <ClipboardList size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto' }} />
            <p>No exam seat plans have been published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {examSeats.map(s => (
              <div key={s.id} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: '8px' }}>
                      <Grid3x3 size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)' }}>{s.title}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="action-btn delete" onClick={() => handleDelete(s.id)} title="Delete Seat Plan">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div style={{ padding: '12px', backgroundColor: 'var(--neutral-50)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span><b>Dept:</b> {s.department} • {s.semester} Semester</span>
                  <span><b>Grid:</b> {s.rows} Rows × {s.columns} Columns</span>
                  {(s.shift || s.group) && <span><b>Info:</b> {s.shift} {s.group}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
