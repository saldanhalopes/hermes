import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Shield, Mail, User, Key } from 'lucide-react';
import { hermesApi } from '../services/api';

const userSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
  role: z.enum(['REQUESTER', 'EVALUATOR', 'CAB_MEMBER', 'IMPLEMENTER', 'AUDITOR', 'ADMIN']),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSuccess }) => {
  const isEditing = !!user;
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
    } : {
      role: 'REQUESTER'
    }
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing) {
        // Remove password from data if empty during edit
        const { password, email, ...updateData } = data;
        await hermesApi(`/users/${user.uid}`, {
          method: 'PATCH',
          body: JSON.stringify(updateData),
        });
      } else {
        await hermesApi('/users', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Erro ao processar solicitação');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-surface-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100 flex justify-between items-center bg-surface-50/50">
          <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
            <User className="text-primary-600" size={20} />
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 rounded-lg transition-all text-surface-400 hover:text-surface-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-surface-500 uppercase ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
              <input 
                {...register('name')}
                placeholder="Ex: João Silva"
                className={`w-full pl-10 pr-4 py-2 bg-white border rounded-xl outline-none transition-all ${
                  errors.name ? 'border-red-300 focus:ring-red-100' : 'border-surface-200 focus:ring-primary-100 focus:border-primary-500'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-surface-500 uppercase ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
              <input 
                {...register('email')}
                type="email"
                disabled={isEditing}
                placeholder="email@empresa.com"
                className={`w-full pl-10 pr-4 py-2 bg-white border rounded-xl outline-none transition-all ${
                  isEditing ? 'bg-surface-50 text-surface-400 border-surface-200' : 
                  errors.email ? 'border-red-300 focus:ring-red-100' : 'border-surface-200 focus:ring-primary-100 focus:border-primary-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          {!isEditing && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-surface-500 uppercase ml-1">Senha Inicial</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input 
                  {...register('password')}
                  type="password"
                  placeholder="******"
                  className={`w-full pl-10 pr-4 py-2 bg-white border rounded-xl outline-none transition-all ${
                    errors.password ? 'border-red-300 focus:ring-red-100' : 'border-surface-200 focus:ring-primary-100 focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-surface-500 uppercase ml-1">Cargo / Perfil</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
              <select 
                {...register('role')}
                className="w-full pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none"
              >
                <option value="REQUESTER">Solicitante</option>
                <option value="EVALUATOR">Avaliador</option>
                <option value="CAB_MEMBER">Membro do Comitê (CAB)</option>
                <option value="IMPLEMENTER">Implementador</option>
                <option value="AUDITOR">Auditor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-surface-200 text-surface-600 font-semibold rounded-xl hover:bg-surface-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-md shadow-primary-200 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
