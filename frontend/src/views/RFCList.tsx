import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, Plus, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    DRAFT: { color: 'bg-surface-100 text-surface-600', label: 'Rascunho' },
    SUBMITTED: { color: 'bg-blue-100 text-blue-600', label: 'Enviada' },
    UNDER_EVALUATION: { color: 'bg-amber-100 text-amber-600', label: 'Em Avaliação' },
    APPROVED: { color: 'bg-emerald-100 text-emerald-600', label: 'Aprovada' },
    REJECTED: { color: 'bg-rose-100 text-rose-600', label: 'Rejeitada' },
    PLANNED: { color: 'bg-sky-100 text-sky-600', label: 'Planejada' },
    IMPLEMENTING: { color: 'bg-purple-100 text-purple-600', label: 'Execução' },
    VERIFICATION: { color: 'bg-teal-100 text-teal-600', label: 'Verificação' },
    CLOSED: { color: 'bg-surface-900 text-white', label: 'Fechada' },
  };

  const config = configs[status] || configs.DRAFT;
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
      {config.label}
    </span>
  );
};

export const RFCList: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [rfcs, setRfcs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!profile?.tenantId) return;

    const q = query(
      collection(db, 'change_requests'),
      where('tenantId', '==', profile.tenantId)
    );

    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
      setRfcs(docs);
    });
  }, [profile]);

  const filteredRfcs = rfcs.filter(r => 
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por título ou ID..." 
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-surface-600 hover:bg-surface-100 rounded-xl transition-all">
            <Filter size={20} /> Filtros
          </button>
          <button onClick={() => navigate('/rfc/new')} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Nova Mudança
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50/50 border-b border-surface-100 text-xs font-bold text-surface-500 tracking-widest uppercase">
              <th className="px-6 py-4">Status / ID</th>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Prioridade</th>
              <th className="px-6 py-4">Data Desejada</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {filteredRfcs.map((rfc) => (
              <tr 
                key={rfc.firestoreId} 
                onClick={() => navigate(`/rfc/${rfc.firestoreId}`)}
                className="hover:bg-primary-50/30 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <StatusBadge status={rfc.status} />
                    <p className="text-xs font-mono text-surface-400">{rfc.id}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="font-semibold text-surface-900 line-clamp-1">{rfc.title}</p>
                  <p className="text-sm text-surface-500 line-clamp-1">{rfc.description}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {rfc.riskLevel === 'HIGH' && <AlertCircle size={16} className="text-rose-500" />}
                    <span className={`font-medium ${
                      rfc.riskLevel === 'HIGH' ? 'text-rose-600' : 
                      rfc.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {rfc.riskLevel}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-surface-600 font-medium">
                  {rfc.desiredDate ? 
                    (rfc.desiredDate.toDate ? 
                      format(rfc.desiredDate.toDate(), "dd MMM, yyyy", { locale: ptBR }) : 
                      format(new Date(rfc.desiredDate), "dd MMM, yyyy", { locale: ptBR })) 
                    : '-'}
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-surface-400 group-hover:text-primary-600 group-hover:bg-primary-50 rounded-lg transition-all">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRfcs.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto text-surface-300">
              <FileText size={40} />
            </div>
            <p className="text-surface-500 font-medium">Nenhuma mudança encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};
