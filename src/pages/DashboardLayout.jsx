import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Megaphone, LogOut, GraduationCap, FileText, Settings, Calendar, ClipboardList, MessageSquare } from 'lucide-react';
import { fetchAPI } from '../api';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profile = await fetchAPI('/users/me');
        if (!['ADMIN', 'PRINCIPAL', 'EXAM_CONTROLLER'].includes(profile.role)) {
          throw new Error('Unauthorized role');
        }
        setUserRole(profile.role);
        setUserName(profile.name);
        setLoading(false);
        
        if (profile.role === 'EXAM_CONTROLLER' && (location.pathname === '/dashboard' || location.pathname === '/dashboard/overview')) {
          navigate('/dashboard/schedules', { replace: true });
        }
      } catch (err) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard/overview': return 'Overview';
      case '/dashboard/users': return 'Manage Users';
      case '/dashboard/announcements': return 'Announcements';
      case '/dashboard/notices': return 'Manage Notices';
      case '/dashboard/settings': return 'System Settings';
      case '/dashboard/schedules': return 'Manage Schedules';
      case '/dashboard/exam-seats': return 'Exam Seat Plans';
      case '/dashboard/results': return 'Manage Results';
      case '/dashboard/chat-groups': return 'Chat Groups';
      default: return 'Dashboard';
    }
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" style={{ borderColor: 'var(--primary-color)' }}></div></div>;
  }

  const roleDisplay = userRole === 'PRINCIPAL' ? 'Principal' : (userRole === 'EXAM_CONTROLLER' ? 'Exam Controller' : 'Administrator');

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '0 8px' }}>
          <img src="/images/tpi.png" alt="TPI Logo" style={{ width: '32px', height: '32px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>TPI Dashboard</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {(userRole === 'ADMIN' || userRole === 'PRINCIPAL') && (
            <>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 8px 4px 8px' }}>Main</p>
              <NavLink to="/dashboard/overview" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><LayoutDashboard size={18} /> Overview</NavLink>
              
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px 8px 4px 8px' }}>Management</p>
              <NavLink to="/dashboard/users" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><Users size={18} /> Users</NavLink>
              <NavLink to="/dashboard/announcements" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><Megaphone size={18} /> Announcements</NavLink>
              <NavLink to="/dashboard/notices" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><FileText size={18} /> Notices</NavLink>
              <NavLink to="/dashboard/chat-groups" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><MessageSquare size={18} /> Chat Groups</NavLink>
            </>
          )}

          {userRole === 'EXAM_CONTROLLER' && (
            <>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 8px 4px 8px' }}>Academic</p>
              <NavLink to="/dashboard/schedules" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><Calendar size={18} /> Schedules / Routines</NavLink>
              <NavLink to="/dashboard/exam-seats" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><ClipboardList size={18} /> Exam Seats</NavLink>
              <NavLink to="/dashboard/results" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><GraduationCap size={18} /> Results</NavLink>
            </>
          )}
          
          {userRole === 'ADMIN' && (
            <>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px 8px 4px 8px' }}>System</p>
              <NavLink to="/dashboard/settings" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}><Settings size={18} /> Settings</NavLink>
            </>
          )}
        </div>
        
        <div onClick={handleLogout} style={{ marginTop: 'auto', padding: '10px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger-color)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <LogOut size={18} /> Sign Out
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ height: '70px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 5 }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600' }}>{getPageTitle()}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{userName || roleDisplay}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{roleDisplay}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'var(--primary-color)' }}>
              {userName ? userName[0].toUpperCase() : roleDisplay[0]}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '32px', flex: 1 }}>
          <Outlet context={{ userRole }} />
        </div>
      </div>
    </div>
  );
}
