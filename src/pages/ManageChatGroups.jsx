import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import { Plus, Users, Search, X, MessageSquare, Trash2 } from 'lucide-react';

export default function ManageChatGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [editGroupId, setEditGroupId] = useState(null);

  // Form State
  const [groupName, setGroupName] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('TEACHER');

  // Filter States for Auto-add
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterShift, setFilterShift] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsRes, usersRes] = await Promise.all([
        fetchAPI('/admin/chat-groups'),
        fetchAPI('/admin/users') // fetches all users
      ]);
      setGroups(groupsRes);
      // Filter out admins/principals so we only assign teachers and students
      setAvailableUsers(usersRes.filter(u => u.role === 'TEACHER' || u.role === 'STUDENT'));
    } catch (err) {
      console.error(err);
      setError('Failed to load chat groups.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || (selectedUserIds.length === 0 && !filterDepartment && !filterSemester && !filterShift)) {
      setError('Please provide a group name and either select participants or choose auto-add criteria.');
      return;
    }
    
    try {
      setError(null);
      const url = editGroupId ? `/admin/chat-groups/${editGroupId}` : '/admin/chat-groups';
      const method = editGroupId ? 'PUT' : 'POST';

      await fetchAPI(url, {
        method,
        body: JSON.stringify({
          name: groupName.trim(),
          participantIds: selectedUserIds,
          department: filterDepartment || undefined,
          semester: filterSemester || undefined,
          shift: filterShift || undefined,
        })
      });
      closeModal();
      loadData();
    } catch (err) {
      setError(err.message || `Failed to ${editGroupId ? 'edit' : 'create'} group`);
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chat group? This action cannot be undone.')) return;
    try {
      await fetchAPI(`/admin/chat-groups/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete group');
    }
  };

  const openEditModal = (group) => {
    setEditGroupId(group.id);
    setGroupName(group.name);
    setSelectedUserIds(group.participants?.map(p => p.userId) || []);
    // Populate dynamic group filters if they exist
    setFilterDepartment(group.targetDepartment || '');
    setFilterSemester(group.targetSemester || '');
    setFilterShift(group.targetShift || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditGroupId(null);
    setGroupName('');
    setSelectedUserIds([]);
    setFilterDepartment('');
    setFilterSemester('');
    setFilterShift('');
    setError(null);
  };

  const toggleUserSelection = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter(uid => uid !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const filteredUsers = availableUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Chat Groups</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create and manage global chat groups for teachers and students.</p>
        </div>
        <button 
          onClick={() => {
            setEditGroupId(null);
            setGroupName('');
            setSelectedUserIds([]);
            setFilterDepartment('');
            setFilterSemester('');
            setFilterShift('');
            setShowModal(true);
          }}
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Plus size={20} />
          Create Group
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div className="loader" style={{ borderColor: 'var(--primary-color)' }}></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {groups.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
              <MessageSquare size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>No Chat Groups Yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Click "Create Group" to make a new chat room.</p>
            </div>
          ) : (
            groups.map(group => (
              <div key={group.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                      <Users size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{group.name}</h3>
                        {(group.targetDepartment || group.targetSemester || group.targetShift) && (
                          <span className="badge" style={{ fontSize: '10px', backgroundColor: 'var(--primary-bg)', color: 'var(--primary-color)' }}>
                            Dynamic
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {group.participants?.length || 0} Participants
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => openEditModal(group)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', padding: '4px' }}
                      title="Edit Group"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteGroup(group.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', padding: '4px' }}
                      title="Delete Group"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: '8px', padding: '12px', maxHeight: '120px', overflowY: 'auto' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Members</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {group.participants?.slice(0, 8).map(p => (
                      <span key={p.userId} style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-main)' }}>
                        {p.user?.name}
                      </span>
                    ))}
                    {group.participants?.length > 8 && (
                      <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                        +{group.participants.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{editGroupId ? 'Edit Chat Group' : 'Create Chat Group'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {error && (
                <div style={{ padding: '12px 16px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-color)', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: '500' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Group Name</label>
                <input 
                  type="text" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Computer Science Faculty"
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Auto-add Students by Criteria (Optional)</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select 
                    value={filterDepartment} 
                    onChange={e => setFilterDepartment(e.target.value)} 
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="">Any Department</option>
                    <option value="Computer Technology">Computer Technology</option>
                    <option value="Civil Technology">Civil Technology</option>
                    <option value="Electrical Technology">Electrical Technology</option>
                    <option value="Mechanical Technology">Mechanical Technology</option>
                  </select>
                  <select 
                    value={filterSemester} 
                    onChange={e => setFilterSemester(e.target.value)} 
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="">Any Semester</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                  </select>
                  <select 
                    value={filterShift} 
                    onChange={e => setFilterShift(e.target.value)} 
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="">Any Shift</option>
                    <option value="1st">1st Shift</option>
                    <option value="2nd">2nd Shift</option>
                  </select>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                    Assign Additional Participants (Teachers, etc.)
                  </label>
                  <span style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: '600' }}>
                    {selectedUserIds.length} Selected
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text"
                      placeholder="Search name or department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                    />
                  </div>
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', backgroundColor: 'white' }}
                  >
                    <option value="ALL">All Roles</option>
                    <option value="TEACHER">Teachers</option>
                    <option value="STUDENT">Students</option>
                  </select>
                </div>

                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', height: '300px', overflowY: 'auto' }}>
                  {filteredUsers.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</div>
                  ) : (
                    filteredUsers.map(user => {
                      const isSelected = selectedUserIds.includes(user.id);
                      return (
                        <div 
                          key={user.id}
                          onClick={() => toggleUserSelection(user.id)}
                          style={{ 
                            padding: '12px 16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'var(--primary-light)' : 'white',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '4px', 
                            border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            backgroundColor: isSelected ? 'var(--primary-color)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isSelected && <div style={{ width: '10px', height: '10px', backgroundColor: 'white', borderRadius: '2px' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', fontSize: '14px' }}>{user.name}</p>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px' }}>
                              {user.role} {user.department && `• ${user.department}`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: 'var(--bg-color)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <button 
                onClick={closeModal}
                style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                className="btn"
                style={{ padding: '12px 32px' }}
              >
                {editGroupId ? 'Save Changes' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
