import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import ManageUsers from './pages/ManageUsers';
import Announcements from './pages/Announcements';
import ManageNotices from './pages/ManageNotices';
import Settings from './pages/Settings';
import ManageSchedules from './pages/ManageSchedules';
import ManageExamSeats from './pages/ManageExamSeats';
import ManageResults from './pages/ManageResults';
import ManageChatGroups from './pages/ManageChatGroups';

import PublicLayout from './pages/public/PublicLayout';
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="notices" element={<ManageNotices />} />
          <Route path="schedules" element={<ManageSchedules />} />
          <Route path="exam-seats" element={<ManageExamSeats />} />
          <Route path="results" element={<ManageResults />} />
          <Route path="chat-groups" element={<ManageChatGroups />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
