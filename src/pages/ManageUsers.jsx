import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Trash2, Shield, BookOpen, Building, Hash, Calendar, Phone, CheckCircle, XCircle, Users } from 'lucide-react';
import { fetchAPI } from '../api';

export default function ManageUsers() {
  const { userRole } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const loadUsers = async () => {
    try {
      const data = await fetchAPI(`/admin/users?search=${encodeURIComponent(search)}`);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(loadUsers, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const updateRole = async (id, role) => {
    try {
      await fetchAPI(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      loadUsers();
      if (selectedUser?.id === id) setSelectedUser(prev => ({ ...prev, role }));
    } catch (err) {
      alert('Error updating role: ' + err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetchAPI(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      loadUsers();
      if (selectedUser?.id === id) setSelectedUser(prev => ({ ...prev, status }));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await fetchAPI(`/admin/users/${id}`, { method: 'DELETE' });
      if (selectedUser?.id === id) setSelectedUser(null);
      loadUsers();
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleEditClick = () => {
    setIsEditingProfile(true);
    setEditFormData({ ...selectedUser });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({});
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await fetchAPI(`/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData),
      });
      setSelectedUser(updatedUser);
      setIsEditingProfile(false);
      loadUsers(); // Refresh list to reflect changes like Name/Dept
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    if (statusFilter === 'ALL') return true;
    return u.status === statusFilter;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Main List Area */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="input-group with-icon" style={{ marginBottom: 0, width: '300px' }}>
            <Search className="icon" size={18} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn-secondary ${statusFilter === 'ALL' ? 'active' : ''}`} style={{ backgroundColor: statusFilter === 'ALL' ? 'var(--bg-color)' : 'white' }} onClick={() => setStatusFilter('ALL')}>All Users</button>
            <button className={`btn-secondary ${statusFilter === 'PENDING' ? 'active' : ''}`} style={{ backgroundColor: statusFilter === 'PENDING' ? 'var(--bg-color)' : 'white' }} onClick={() => setStatusFilter('PENDING')}>Pending</button>
            <button className={`btn-secondary ${statusFilter === 'APPROVED' ? 'active' : ''}`} style={{ backgroundColor: statusFilter === 'APPROVED' ? 'var(--bg-color)' : 'white' }} onClick={() => setStatusFilter('APPROVED')}>Approved</button>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}><div className="loader" style={{ borderColor: 'var(--primary-color)' }}></div></div>
          ) : error ? (
            <div style={{ padding: '24px', color: 'var(--danger-color)' }}>{error}</div>
          ) : (
            <table>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Department</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ cursor: 'pointer', backgroundColor: selectedUser?.id === u.id ? 'var(--bg-color)' : 'transparent' }} onClick={() => { setSelectedUser(u); setIsEditingProfile(false); }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{u.name}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`badge`} style={{ 
                        backgroundColor: u.status === 'APPROVED' ? 'var(--success-bg)' : u.status === 'PENDING' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                        color: u.status === 'APPROVED' ? 'var(--success-color)' : u.status === 'PENDING' ? 'var(--warning-color)' : 'var(--danger-color)'
                      }}>
                        {u.status || 'APPROVED'}
                      </span>
                    </td>
                    <td>{u.department || '-'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Slide-out User Details Panel */}
      {selectedUser && (
        <div className="card animate-fade-in" style={{ width: '360px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ padding: '32px 24px', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', margin: '0 auto 16px auto' }}>
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            
            {isEditingProfile ? (
              <input 
                type="text" 
                className="input-field" 
                value={editFormData.name || ''} 
                onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                style={{ textAlign: 'center', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}
                placeholder="Full Name"
              />
            ) : (
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{selectedUser.name}</h3>
            )}
            
            {isEditingProfile ? (
              <input 
                type="email" 
                className="input-field" 
                value={editFormData.email || ''} 
                onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                style={{ textAlign: 'center', fontSize: '14px', marginBottom: '16px' }}
                placeholder="Email Address"
              />
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{selectedUser.email}</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <span className={`badge badge-${selectedUser.role.toLowerCase()}`}>{selectedUser.role}</span>
              <span className={`badge`} style={{ 
                backgroundColor: selectedUser.status === 'APPROVED' ? 'var(--success-bg)' : selectedUser.status === 'PENDING' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                color: selectedUser.status === 'APPROVED' ? 'var(--success-color)' : selectedUser.status === 'PENDING' ? 'var(--warning-color)' : 'var(--danger-color)'
              }}>
                {selectedUser.status || 'APPROVED'}
              </span>
            </div>
          </div>

          <div style={{ padding: '24px', flex: 1 }}>
            
            {/* Approval Actions */}
            {selectedUser.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, backgroundColor: 'var(--success-color)' }}
                  onClick={() => updateStatus(selectedUser.id, 'APPROVED')}
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, backgroundColor: 'var(--danger-color)' }}
                  onClick={() => updateStatus(selectedUser.id, 'REJECTED')}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Profile Details</h4>
              {userRole === 'ADMIN' && (
                <button 
                  onClick={isEditingProfile ? handleSaveProfile : handleEditClick} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(selectedUser.department || isEditingProfile) && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Building size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Department</p>
                    {isEditingProfile ? (
                      <input type="text" className="input-field" value={editFormData.department || ''} onChange={e => setEditFormData({...editFormData, department: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} placeholder="e.g. Computer Science" />
                    ) : <p style={{ fontWeight: '500' }}>{selectedUser.department}</p>}
                  </div>
                </div>
              )}
              
              {(selectedUser.phone || isEditingProfile) && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Phone size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Phone</p>
                    {isEditingProfile ? (
                      <input type="text" className="input-field" value={editFormData.phone || ''} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} placeholder="Phone number" />
                    ) : <p style={{ fontWeight: '500' }}>{selectedUser.phone}</p>}
                  </div>
                </div>
              )}

              {/* Student Fields */}
              {(selectedUser.role === 'STUDENT') && (
                <>
                  {(selectedUser.boardRoll || isEditingProfile) && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <Hash size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Board Roll</p>
                        {isEditingProfile ? <input type="text" className="input-field" value={editFormData.boardRoll || ''} onChange={e => setEditFormData({...editFormData, boardRoll: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} /> : <p style={{ fontWeight: '500' }}>{selectedUser.boardRoll}</p>}
                      </div>
                    </div>
                  )}
                  {(selectedUser.regNo || isEditingProfile) && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <Hash size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registration No</p>
                        {isEditingProfile ? <input type="text" className="input-field" value={editFormData.regNo || ''} onChange={e => setEditFormData({...editFormData, regNo: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} /> : <p style={{ fontWeight: '500' }}>{selectedUser.regNo}</p>}
                      </div>
                    </div>
                  )}
                  {(selectedUser.semester || isEditingProfile) && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <BookOpen size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Semester</p>
                        {isEditingProfile ? <input type="text" className="input-field" value={editFormData.semester || ''} onChange={e => setEditFormData({...editFormData, semester: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} /> : <p style={{ fontWeight: '500' }}>{selectedUser.semester}</p>}
                      </div>
                    </div>
                  )}
                  {(selectedUser.shift || isEditingProfile) && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <Calendar size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Shift</p>
                        {isEditingProfile ? <input type="text" className="input-field" value={editFormData.shift || ''} onChange={e => setEditFormData({...editFormData, shift: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} /> : <p style={{ fontWeight: '500' }}>{selectedUser.shift}</p>}
                      </div>
                    </div>
                  )}
                  {(selectedUser.group || isEditingProfile) && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <Users size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Group</p>
                        {isEditingProfile ? <input type="text" className="input-field" value={editFormData.group || ''} onChange={e => setEditFormData({...editFormData, group: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} /> : <p style={{ fontWeight: '500' }}>{selectedUser.group}</p>}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Staff Fields */}
              {['TEACHER', 'PRINCIPAL', 'EXAM_CONTROLLER', 'ADMIN'].includes(selectedUser.role) && (
                <>
                  {(selectedUser.employeeId || isEditingProfile) && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <Shield size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Employee ID</p>
                        {isEditingProfile ? <input type="text" className="input-field" value={editFormData.employeeId || ''} onChange={e => setEditFormData({...editFormData, employeeId: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} /> : <p style={{ fontWeight: '500' }}>{selectedUser.employeeId}</p>}
                      </div>
                    </div>
                  )}
                  {(selectedUser.designation || isEditingProfile) && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <BookOpen size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Designation</p>
                        {isEditingProfile ? <input type="text" className="input-field" value={editFormData.designation || ''} onChange={e => setEditFormData({...editFormData, designation: e.target.value})} style={{ padding: '6px 12px', marginTop: '4px' }} /> : <p style={{ fontWeight: '500' }}>{selectedUser.designation}</p>}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Calendar size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                <div><p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Joined Date</p><p style={{ fontWeight: '500' }}>{new Date(selectedUser.createdAt).toLocaleDateString()}</p></div>
              </div>
              
              {isEditingProfile && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={handleCancelEdit}>Cancel</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handleSaveProfile}>Save Changes</button>
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />
            
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Actions</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userRole === 'ADMIN' && (
                <select 
                  className="input-field" 
                  value={selectedUser.role} 
                  onChange={(e) => updateRole(selectedUser.id, e.target.value)}
                >
                  <option value="STUDENT">Change to Student</option>
                  <option value="TEACHER">Change to Teacher</option>
                  <option value="PRINCIPAL">Change to Principal</option>
                  <option value="EXAM_CONTROLLER">Change to Exam Controller</option>
                  <option value="ADMIN">Change to Admin</option>
                </select>
              )}
              
              {selectedUser.status !== 'PENDING' && (
                <select 
                  className="input-field" 
                  value={selectedUser.status || 'APPROVED'} 
                  onChange={(e) => updateStatus(selectedUser.id, e.target.value)}
                >
                  <option value="APPROVED">Status: APPROVED</option>
                  <option value="REJECTED">Status: REJECTED</option>
                  <option value="PENDING">Status: PENDING</option>
                </select>
              )}
              
              {userRole === 'ADMIN' && (
                <button 
                  className="btn-primary" 
                  style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-color)' }}
                  onClick={() => deleteUser(selectedUser.id)}
                >
                  <Trash2 size={16} /> Delete User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
