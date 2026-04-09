import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Calendar,
  Settings,
  History,
  Send,
  CheckCircle,
  PlayCircle,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { hermesApi } from '../services/api';
import { toast } from 'sonner';
import { RiskAssessmentMatrix } from '../components/rfc/RiskAssessmentMatrix';
import { ActionPlanList, Task } from '../components/rfc/ActionPlanList';

enum RfcStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_EVALUATION = 'UNDER_EVALUATION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PLANNED = 'PLANNED',
  IMPLEMENTING = 'IMPLEMENTING',
  VERIFICATION = 'VERIFICATION',
  CLOSED = 'CLOSED',
}

export const RFCDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [rfc, setRfc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [tempTasks, setTempTasks] = useState<Task[]>([]);
  const [tempScores, setTempScores] = useState<any[]>([]);

  useEffect(() => {
    fetchRfc();
  }, [id]);

  const fetchRfc = async () => {
    try {
      setLoading(true);
      const data = await hermesApi.get(`/rfc/${id}`);
      setRfc(data);
      if (data.tasks) setTempTasks(data.tasks);
      if (data.impactAssessment) setTempScores(data.impactAssessment);
    } catch (error) {
      toast.error('Erro ao carregar RFC');
      navigate('/rfcs');
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (targetStatus: RfcStatus, comment?: string, metadata?: any) => {
    try {
      await hermesApi.patch(`/rfc/${id}/transition`, {
        status: targetStatus,
        comment: comment || `Mudança de status para ${targetStatus}`,
        metadata
      });
      toast.success(`Status atualizado para ${targetStatus}`);
      fetchRfc();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Falha na transição');
    }
  };

  if (loading) return <div className="animate-pulse flex items-center justify-center min-h-[400px]">Carregando detalhes...</div>;
  if (!rfc) return <div>RFC não encontrada.</div>;

  const StatusBadge = ({ status }: { status: string }) => {
    const configs: any = {
      DRAFT: { color: 'bg-surface-100 text-surface-600', icon: <Clock size={14} /> },
      SUBMITTED: { color: 'bg-indigo-100 text-indigo-600', icon: <Send size={14} /> },
      UNDER_EVALUATION: { color: 'bg-amber-100 text-amber-600', icon: <AlertCircle size={14} /> },
      APPROVED: { color: 'bg-emerald-100 text-emerald-600', icon: <CheckCircle2 size={14} /> },
      REJECTED: { color: 'bg-rose-100 text-rose-600', icon: <XCircle size={14} /> },
      PLANNED: { color: 'bg-sky-100 text-sky-600', icon: <Calendar size={14} /> },
      IMPLEMENTING: { color: 'bg-purple-100 text-purple-600', icon: <PlayCircle size={14} /> },
      VERIFICATION: { color: 'bg-teal-100 text-teal-600', icon: <ShieldCheck size={14} /> },
      CLOSED: { color: 'bg-surface-800 text-white', icon: <CheckCircle size={14} /> },
    };
    const config = configs[status] || configs.DRAFT;
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
        {config.icon} {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/rfcs')} className="p-2 hover:bg-surface-100 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-surface-900">{rfc.id}</h2>
              <StatusBadge status={rfc.status} />
            </div>
            <p className="text-surface-500 font-medium">{rfc.title}</p>
          </div>
        </div>
        
        {/* Actions based on status and role */}
        <div className="flex gap-2">
          {rfc.status === RfcStatus.DRAFT && (profile.role === 'REQUESTER' || profile.role === 'ADMIN') && (
            <button onClick={() => handleTransition(RfcStatus.SUBMITTED)} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
              <Send size={16} /> Submeter para Avaliação
            </button>
          )}

          {rfc.status === RfcStatus.SUBMITTED && (profile.role === 'EVALUATOR' || profile.role === 'ADMIN') && (
            <button onClick={() => handleTransition(RfcStatus.UNDER_EVALUATION)} className="bg-amber-100 text-amber-700 hover:bg-amber-200 py-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertCircle size={16} /> Iniciar Avaliação
            </button>
          )}

          {rfc.status === RfcStatus.UNDER_EVALUATION && (profile.role === 'CAB_MEMBER' || profile.role === 'ADMIN') && (
            <>
              <button onClick={() => handleTransition(RfcStatus.REJECTED)} className="bg-rose-100 text-rose-700 hover:bg-rose-200 py-2 px-4 rounded-xl text-sm font-bold">
                Rejeitar
              </button>
              <button onClick={() => handleTransition(RfcStatus.APPROVED)} className="bg-emerald-600 text-white hover:bg-emerald-700 py-2 px-6 rounded-xl text-sm font-bold">
                Aprovar Mudança
              </button>
            </>
          )}

          {rfc.status === RfcStatus.APPROVED && (profile.role === 'IMPLEMENTER' || profile.role === 'ADMIN') && (
            <button onClick={() => handleTransition(RfcStatus.PLANNED)} className="bg-sky-600 text-white hover:bg-sky-700 py-2 px-6 rounded-xl text-sm font-bold">
              Criar Plano de Execução
            </button>
          )}

          {rfc.status === RfcStatus.PLANNED && (profile.role === 'IMPLEMENTER' || profile.role === 'ADMIN') && (
            <button onClick={() => handleTransition(RfcStatus.IMPLEMENTING)} className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-6 rounded-xl text-sm font-bold flex items-center gap-2">
              <PlayCircle size={16} /> Iniciar Implementação
            </button>
          )}

          {rfc.status === RfcStatus.IMPLEMENTING && (profile.role === 'IMPLEMENTER' || profile.role === 'ADMIN') && (
            <button onClick={() => handleTransition(RfcStatus.VERIFICATION)} className="bg-teal-600 text-white hover:bg-teal-700 py-2 px-6 rounded-xl text-sm font-bold">
              Finalizar e Solicitar Verificação
            </button>
          )}

          {rfc.status === RfcStatus.VERIFICATION && (profile.role === 'AUDITOR' || profile.role === 'ADMIN') && (
            <button onClick={() => handleTransition(RfcStatus.CLOSED)} className="bg-surface-900 text-white hover:bg-black py-2 px-6 rounded-xl text-sm font-bold">
              Fechar RFC (Sucesso)
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-surface-200">
            {[
              { id: 'general', label: 'Informações' },
              { id: 'impact', label: 'Risco & Impacto' },
              { id: 'plan', label: 'Plano de Ação' },
              { id: 'history', label: 'Histórico' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                  activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-400 hover:text-surface-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-card p-8 min-h-[300px] animate-fade-in">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Descrição</h3>
                  <p className="text-surface-700 leading-relaxed">{rfc.description}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Justificativa</h3>
                  <p className="text-surface-700 leading-relaxed">{rfc.justification}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-50 rounded-xl">
                    <p className="text-xs font-bold text-surface-400 uppercase mb-1">Solicitante</p>
                    <p className="text-sm font-bold text-surface-900 truncate">{rfc.requesterId}</p>
                  </div>
                  <div className="p-4 bg-surface-50 rounded-xl">
                    <p className="text-xs font-bold text-surface-400 uppercase mb-1">Criado em</p>
                    <p className="text-sm font-bold text-surface-900">
                      {new Date(rfc.createdAt?._seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-6">
                <RiskAssessmentMatrix 
                  scores={tempScores} 
                  onChange={setTempScores}
                  readOnly={rfc.status !== RfcStatus.UNDER_EVALUATION || (profile.role !== 'EVALUATOR' && profile.role !== 'ADMIN')}
                />
                
                {rfc.status === RfcStatus.UNDER_EVALUATION && (profile.role === 'EVALUATOR' || profile.role === 'ADMIN') && (
                  <button 
                    onClick={() => handleTransition(rfc.status, 'Atualização de Avaliação', { impactAssessment: tempScores })}
                    className="w-full py-3 bg-surface-100 text-surface-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-surface-200 transition-all"
                  >
                    Salvar Mudanças na Avaliação
                  </button>
                )}
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4 text-surface-900">
                  <ClipboardList size={20} />
                  <h3 className="font-bold">Plano de Implementação</h3>
                </div>
                
                <ActionPlanList 
                  tasks={tempTasks} 
                  onChange={setTempTasks}
                  readOnly={rfc.status !== RfcStatus.PLANNED || (profile.role !== 'IMPLEMENTER' && profile.role !== 'ADMIN')}
                  canToggleStatus={rfc.status === RfcStatus.IMPLEMENTING || rfc.status === RfcStatus.VERIFICATION}
                />

                {(rfc.status === RfcStatus.PLANNED || rfc.status === RfcStatus.IMPLEMENTING) && (
                  <button 
                    onClick={() => handleTransition(rfc.status, 'Atualização de Plano de Ação', { tasks: tempTasks })}
                    className="w-full py-3 bg-primary-50 text-primary-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-100 transition-all"
                  >
                    Salvar Progresso do Plano
                  </button>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {Object.keys(rfc)
                  .filter(key => key.startsWith('history_'))
                  .map(key => {
                    const stage = key.replace('history_', '');
                    const hist = rfc[key];
                    return (
                      <div key={key} className="relative pl-8 pb-4 border-l-2 border-surface-100 last:pb-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary-500" />
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-surface-900">{stage}</p>
                          <p className="text-[10px] font-medium text-surface-400">
                            {new Date(hist.at?._seconds * 1000).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-surface-500 mb-2">Por {hist.userName}</p>
                        {hist.comment && (
                          <div className="p-3 bg-surface-50 rounded-lg text-xs italic text-surface-600">
                            "{hist.comment}"
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Metadata/Summary Card */}
          <div className="glass-card p-6 bg-primary-900 text-white">
            <h3 className="text-sm font-bold opacity-70 mb-4 flex items-center gap-2">
              <Settings size={16} /> Detalhes do Sistema
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-50">Tenant ID</p>
                <p className="text-xs font-mono">{rfc.tenantId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-50">Document ID</p>
                <p className="text-xs font-mono">{rfc.firestoreId}</p>
              </div>
            </div>
          </div>
          
          {/* Timeline Simplified */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-surface-900 mb-6">Status da Mudança</h3>
            <div className="space-y-6">
              {[
                { s: RfcStatus.SUBMITTED, l: 'Submissão' },
                { s: RfcStatus.APPROVED, l: 'Aprovação' },
                { s: RfcStatus.VERIFICATION, l: 'Execução' },
                { s: RfcStatus.CLOSED, l: 'Fechamento' },
              ].map((step, idx) => {
                const isCompleted = Object.keys(rfc).some(k => k === `history_${step.s}`);
                const isCurrent = rfc.status === step.s;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-amber-500 text-white animate-pulse' : 'bg-surface-100 text-surface-400'
                    }`}>
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-surface-900' : 'text-surface-500'}`}>{step.l}</p>
                      {isCompleted && <p className="text-[10px] text-emerald-600 font-bold">Concluído</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
