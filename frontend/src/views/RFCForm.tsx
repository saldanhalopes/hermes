import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, ArrowRight, Save, ClipboardList, ShieldAlert, Calendar } from 'lucide-react';

const rfcSchema = z.object({
  title: z.string().min(10, 'O título deve ter pelo menos 10 caracteres'),
  description: z.string().min(20, 'Forneça uma descrição detalhada'),
  justification: z.string().min(20, 'A justificativa é obrigatória para conformidade'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  scope: z.string().min(10, 'Defina o escopo da mudança'),
  impactSecurity: z.string().min(1, 'Defina o impacto de segurança'),
  impactFinancial: z.string().min(1, 'Defina o impacto financeiro'),
  impactOperational: z.string().min(1, 'Defina o impacto operacional'),
  rollbackPlan: z.string().min(20, 'O plano de rollback é crítico para aprovação'),
  desiredDate: z.string().min(1, 'Selecione uma data desejada'),
});

type FormData = z.infer<typeof rfcSchema>;

const StepIndicator = ({ current, total }: { current: number, total: number }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div 
        key={i} 
        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
          i + 1 <= current ? 'bg-primary-600' : 'bg-surface-200'
        }`}
      />
    ))}
  </div>
);

export const RFCForm: React.FC = () => {
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(rfcSchema),
    mode: 'onChange',
    defaultValues: { riskLevel: 'LOW' }
  });

  const onSubmit = async (data: FormData) => {
    console.log('Submitting RFC:', { ...data, tenantId: profile.tenantId });
    // Invocaria o serviço do Firebase ou API NestJS aqui
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-surface-100 rounded-lg transition-all text-surface-400">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-surface-900">Nova Solicitação de Mudança</h2>
      </div>

      <StepIndicator current={step} total={3} />

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-10 space-y-8 animate-slide-up">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary-600 mb-2">
              <ClipboardList size={22} />
              <h3 className="text-lg font-bold">Informações Básicas</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Título da Mudança</label>
              <input {...register('title')} className="form-input" placeholder="Ex: Atualização do Banco de Dados de Produção" />
              {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Descrição Detalhada</label>
              <textarea {...register('description')} rows={4} className="form-input" placeholder="Explique detalhadamente o que será alterado..." />
              {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Justificativa de Negócio</label>
              <textarea {...register('justification')} rows={3} className="form-input" placeholder="Por que esta mudança é necessária agora?" />
              {errors.justification && <p className="text-xs text-rose-500 font-medium">{errors.justification.message}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary-600 mb-2">
              <ShieldAlert size={22} />
              <h3 className="text-lg font-bold">Análise de Risco e Impacto</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Nível de Risco Inicial</label>
              <select {...register('riskLevel')} className="form-input">
                <option value="LOW">Baixo - Sem interrupção de serviço</option>
                <option value="MEDIUM">Médio - Possível interrupção breve</option>
                <option value="HIGH">Alto - Interrupção crítica ou alto impacto financeiro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Escopo da Mudança</label>
              <textarea {...register('scope')} rows={2} className="form-input" placeholder="O que está dentro e fora desta mudança?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Impacto Segurança</label>
                <input {...register('impactSecurity')} className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Impacto Financeiro</label>
                <input {...register('impactFinancial')} className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-surface-500 uppercase tracking-wider">Impacto Operacional</label>
                <input {...register('impactOperational')} className="form-input" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary-600 mb-2">
              <Calendar size={22} />
              <h3 className="text-lg font-bold">Rollback e Agendamento</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Plano de Rollback (Retorno)</label>
              <textarea {...register('rollbackPlan')} rows={4} className="form-input" placeholder="Passo a passo para reverter caso a implementação falhe..." />
              {errors.rollbackPlan && <p className="text-xs text-rose-500 font-medium">{errors.rollbackPlan.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-surface-700">Data Desejada para Implementação</label>
              <input type="datetime-local" {...register('desiredDate')} className="form-input" />
              {errors.desiredDate && <p className="text-xs text-rose-500 font-medium">{errors.desiredDate.message}</p>}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t border-surface-100">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-2 text-surface-600 font-semibold hover:bg-surface-50 rounded-xl transition-all">
              <ArrowLeft size={18} /> Anterior
            </button>
          ) : <div />}

          {step < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2 px-8">
              Próximo <ArrowRight size={18} />
            </button>
          ) : (
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-8 py-2 rounded-xl transition-all shadow-lg shadow-emerald-200">
              <Save size={18} /> Salvar e Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
