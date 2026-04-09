import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Shield, Clock, User, Activity } from 'lucide-react';
import { format } from 'date-fns';

export const AuditLogs: React.FC = () => {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/audit-logs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Falha ao carregar logs. Verifique suas permissões.');

        const data = await response.json();
        setLogs(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  if (profile?.role !== 'ADMIN' && profile?.role !== 'AUDITOR') {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Shield className="h-16 w-16 text-red-500" />
        <h2 className="text-xl font-semibold">Acesso Restrito</h2>
        <p className="text-surface-500">Você não tem permissão para visualizar a Trilha de Auditoria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Trilha de Auditoria</h1>
          <p className="text-surface-500">Histórico completo de ações e alterações do sistema</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase">Usuário</th>
                <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase">Ação</th>
                <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase">Endpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-surface-500">Carregando logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-surface-500">Nenhum log encontrado.</td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-2 text-sm text-surface-600">
                      <Clock className="h-4 w-4 text-surface-400" />
                      {log.timestamp ? format(log.timestamp.seconds * 1000, 'dd/MM/yyyy HH:mm:ss') : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-2 text-sm text-surface-900 font-medium">
                      <User className="h-4 w-4 text-primary-500" />
                      {log.userId.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                      <Activity className="h-3 w-3 mr-1" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500">
                     {JSON.stringify(log.payload).substring(0, 50)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
