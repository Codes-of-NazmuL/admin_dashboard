import React from 'react';
import { Save, Shield, Bell, Globe } from 'lucide-react';

export default function Settings() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe size={24} color="var(--primary-color)" />
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Platform Settings</h3>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="input-group">
            <label>Institution Name</label>
            <input className="input-field" defaultValue="Tangail Polytechnic Institute" />
          </div>
          <div className="input-group">
            <label>Support Email</label>
            <input className="input-field" type="email" defaultValue="support@campusconnect.com" />
          </div>
          <button className="btn-primary" style={{ marginTop: '16px' }}><Save size={16} /> Save Changes</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={24} color="var(--warning-color)" />
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Security & Roles</h3>
        </div>
        <div style={{ padding: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Require strong passwords for all users</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Allow teachers to broadcast globally</span>
          </label>
          <button className="btn-secondary" style={{ marginTop: '8px' }}>Update Security Policy</button>
        </div>
      </div>
      
      <div className="card">
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bell size={24} color="var(--info-color)" />
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Notifications</h3>
        </div>
        <div style={{ padding: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Email admins on new teacher registration</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Send daily usage reports</span>
          </label>
        </div>
      </div>
    </div>
  );
}
