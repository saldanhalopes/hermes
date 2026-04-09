import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Bell,
  Users
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import NotificationBell from './NotificationBell';

const SidebarItem = ({ to, icon: Icon, label, active }: any) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active ? 'bg-primary-600 text-white shadow-lg' : 'text-surface-600 hover:bg-surface-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const isAdminOrAuditor = profile?.role === 'ADMIN' || profile?.role === 'AUDITOR';

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-surface-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
          <span className="text-xl font-bold text-surface-900 tracking-tight">Hermes Control</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem to="/rfc" icon={FileText} label="Mudanças" active={location.pathname.startsWith('/rfc')} />
          {profile?.role === 'ADMIN' && (
            <SidebarItem to="/users" icon={Users} label="Usuários" active={location.pathname === '/users'} />
          )}
          <SidebarItem to="/approvals" icon={CheckSquare} label="Aprovações" active={location.pathname === '/approvals'} />
          {isAdminOrAuditor && (
            <SidebarItem to="/audit" icon={ShieldCheck} label="Auditoria" active={location.pathname === '/audit'} />
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-surface-100 flex flex-col gap-2">
          <SidebarItem to="/settings" icon={Settings} label="Configurações" active={location.pathname === '/settings'} />
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-200 px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-surface-800">
            {profile?.tenantName || 'Bem-vindo'}
          </h1>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-3 pl-4 border-l border-surface-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-surface-900">{profile?.name}</p>
                <p className="text-xs text-surface-500 capitalize">{profile?.role?.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-surface-200 rounded-full flex items-center justify-center text-surface-600 font-bold overflow-hidden">
                {profile?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
