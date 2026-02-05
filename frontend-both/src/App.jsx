import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import DynamicNavbar from './components/DynamicNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

import StationMasterDashboard from './pages/station-master/StationMasterDashboard';
import AddStation from './pages/station-master/AddStation';
import MyStations from './pages/station-master/MyStations';
import StationBookings from './pages/station-master/StationBookings';
import StationMasterAnalytics from './pages/station-master/StationMasterAnalytics';
import StationMasterReviews from './pages/station-master/StationMasterReviews';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStations from './pages/admin/ManageStations';
import AdminReservations from './pages/admin/AdminReservations';
import AdminContacts from './pages/admin/AdminContacts';
import AdminReports from './pages/admin/AdminReports';

import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/map'];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="App">
      <DynamicNavbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/find-chargers" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          } />
          <Route path="/reservations" element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/station-master/dashboard" element={
            <ProtectedRoute requiredRole="StationMaster">
              <StationMasterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/station-master/add-station" element={
            <ProtectedRoute requiredRole="StationMaster">
              <AddStation />
            </ProtectedRoute>
          } />
          <Route path="/station-master/stations" element={
            <ProtectedRoute requiredRole="StationMaster">
              <MyStations />
            </ProtectedRoute>
          } />
          <Route path="/station-master/analytics" element={
            <ProtectedRoute requiredRole="StationMaster">
              <StationMasterAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/station-master/bookings" element={
            <ProtectedRoute requiredRole="StationMaster">
              <StationBookings />
            </ProtectedRoute>
          } />
          <Route path="/station-master/reviews" element={
            <ProtectedRoute requiredRole="StationMaster">
              <StationMasterReviews />
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/stations" element={
            <ProtectedRoute requiredRole="Admin">
              <ManageStations />
            </ProtectedRoute>
          } />
          <Route path="/admin/reservations" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminReservations />
            </ProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminContacts />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminReports />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!shouldHideFooter && <Footer />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-800)',
            color: 'var(--fg)',
            border: '1px solid rgba(173, 33, 255, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginTop: '80px',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--fg)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'var(--fg)',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;