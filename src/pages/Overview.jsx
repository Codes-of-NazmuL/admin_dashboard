import React, { useEffect, useState } from 'react';
import { Users, BookOpen, MessageSquare, Megaphone, Activity } from 'lucide-react';
import { fetchAPI } from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState({ totalUsers: 0, students: 0, teachers: 0, announcements: 0, pendingApprovals: 0 });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, analyticsData] = await Promise.all([
          fetchAPI('/admin/stats'),
          fetchAPI('/admin/analytics')
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><div className="loader" style={{ borderColor: 'var(--primary-color)' }}></div></div>;

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div className={`badge ${colorClass}`} style={{ padding: '12px', borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
      <div>
        <h3 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.2' }}>{value}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{title}</p>
        {subtitle && <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <StatCard title="Total Users" value={stats.totalUsers} subtitle="Across all roles" icon={Users} colorClass="badge-all" />
        <StatCard title="Active Students" value={stats.students} icon={BookOpen} colorClass="badge-student" />
        <StatCard title="Faculty Members" value={stats.teachers} icon={Users} colorClass="badge-teacher" />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} subtitle="Awaiting review" icon={Activity} colorClass="badge-admin" style={{ backgroundColor: 'var(--warning-bg)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Activity size={20} color="var(--primary-color)" />
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Registration Activity (Last 7 Days)</h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.trendData || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="users" stroke="var(--primary-color)" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px' }}>Students by Department</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.departmentData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip cursor={{ fill: 'var(--bg-color)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="var(--info-color)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Total Messages Sent</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <MessageSquare size={24} color="var(--info-color)" />
            <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{analytics?.totalMessages || 0}</h3>
          </div>
        </div>
        <div style={{ width: '1px', height: '60px', backgroundColor: 'var(--border-color)' }}></div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Active Chat Rooms</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Users size={24} color="var(--warning-color)" />
            <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{analytics?.totalChatRooms || 0}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
