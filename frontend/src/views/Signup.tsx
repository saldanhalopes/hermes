import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Mail, Lock, Building, ArrowRight } from 'lucide-react';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenantId: '',
    role: 'ADMIN', // Default for first user in tenant
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call Backend to handle Signup + Custom Claims
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao cadastrar');
      }

      toast.success('Tenant criado com sucesso! Faça login agora.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="glass-card p-8 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-surface-900">Novo Tenant</h1>
          <p className="text-surface-500">Inicie sua organização no Hermes Control</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Building className="absolute left-3 top-3 h-5 w-5 text-surface-400" />
              <input
                type="text"
                placeholder="Identificador da Empresa (ex: acme-corp)"
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={formData.tenantId}
                onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-surface-400" />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-surface-400" />
              <input
                type="password"
                placeholder="Senha (mín. 6 caracteres)"
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Processando...' : (
              <>
                Cadastrar <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-surface-500">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Voltar para o Login
          </Link>
        </p>
      </div>
    </div>
  );
};
