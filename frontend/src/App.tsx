import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './views/Dashboard';
import { RFCList } from './views/RFCList';
import { RFCForm } from './views/RFCForm';
import { Login } from './views/Login';
import { Signup } from './views/Signup';
import { AuditLogs } from './views/AuditLogs';
import { UsersDashboard } from './views/Users';
import { RFCDetails } from './views/RFCDetails';
import { Toaster } from 'sonner';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-surface-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Rotas Protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout children={<Navigate to="/dashboard" />} />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/rfc" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RFCList />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/rfc/new" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RFCForm />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/rfc/:id" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RFCDetails />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UsersDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/audit" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AuditLogs />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
