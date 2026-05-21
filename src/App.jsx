import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Home from './pages/citizen/Home';
import ReportIssue from './pages/citizen/ReportIssue';
import TrackTicket from './pages/citizen/TrackTicket';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import Alerts from './pages/citizen/Alerts';
import Jobs from './pages/citizen/Jobs';
import JobApply from './pages/citizen/JobApply';
import JobTrack from './pages/citizen/JobTrack';
import QueueBooking from './pages/citizen/QueueBooking';
import Notices from './pages/citizen/Notices';
import Emergency from './pages/citizen/Emergency';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OtpVerify from './pages/auth/OtpVerify';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminBilling from './pages/admin/AdminBilling';
import AdminBillsManage from './pages/admin/AdminBillsManage';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminJobs from './pages/admin/AdminJobs';
import AdminQueue from './pages/admin/AdminQueue';
import AdminNotices from './pages/admin/AdminNotices';
import AdminResidents from './pages/admin/AdminResidents';
import AdminDisputes from './pages/admin/AdminDisputes';
import AdminReportsHub from './pages/admin/AdminReportsHub';
import AdminAudit from './pages/admin/AdminAudit';

function StaffRoute({ children }) {
  return <ProtectedRoute roles={['staff', 'admin']}>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <Router>
      <div className="app-wrapper flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/track" element={<TrackTicket />} />
          <Route path="/billing" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['citizen']} requireVerified><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/track" element={<JobTrack />} />
          <Route path="/jobs/:id" element={<JobApply />} />
          <Route path="/queue" element={<QueueBooking />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/emergency" element={<Emergency />} />

          <Route path="/admin" element={<StaffRoute><AdminDashboard /></StaffRoute>} />
          <Route path="/admin/reports" element={<StaffRoute><AdminReports /></StaffRoute>} />
          <Route path="/admin/billing" element={<StaffRoute><AdminBilling /></StaffRoute>} />
          <Route path="/admin/bills" element={<StaffRoute><AdminBillsManage /></StaffRoute>} />
          <Route path="/admin/residents" element={<StaffRoute><AdminResidents /></StaffRoute>} />
          <Route path="/admin/disputes" element={<StaffRoute><AdminDisputes /></StaffRoute>} />
          <Route path="/admin/reports-hub" element={<StaffRoute><AdminReportsHub /></StaffRoute>} />
          <Route path="/admin/audit" element={<StaffRoute><AdminAudit /></StaffRoute>} />
          <Route path="/admin/alerts" element={<StaffRoute><AdminAlerts /></StaffRoute>} />
          <Route path="/admin/jobs" element={<StaffRoute><AdminJobs /></StaffRoute>} />
          <Route path="/admin/queue" element={<StaffRoute><AdminQueue /></StaffRoute>} />
          <Route path="/admin/notices" element={<StaffRoute><AdminNotices /></StaffRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
