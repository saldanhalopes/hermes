import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="glass-card p-8 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-surface-900">Hermes Control</h1>
          <p className="text-surface-500">Acesse sua conta para gerenciar mudanças</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-surface-400" />
              <input
                type="email"
                placeholder="E-mail corporativo"
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-surface-400" />
              <input
                type="password"
                placeholder="Senha"
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Entrando...' : (
              <>
                Entrar <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-surface-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-surface-400">Desenvolvimento</span></div>
          </div>

          <button
            type="button"
            className="w-full py-2 bg-secondary-50 text-secondary-700 border border-secondary-200 rounded-lg hover:bg-secondary-100 transition-all font-medium text-sm"
            onClick={() => {
              localStorage.setItem('MOCK_ACCESS_TOKEN', 'dev-token');
              toast.success('Entrando em Modo Desenvolvedor (Mock)');
              navigate('/dashboard');
            }}
          >
            Acessar sem Firebase (Modo Mock)
          </button>
        </form>

        <p className="text-center text-sm text-surface-500">
          Não tem uma conta?{' '}
          <Link to="/signup" className="text-primary-600 font-medium hover:underline">
            Cadastre um novo Tenant
          </Link>
        </p>
        {/* Social Proof for Audit Compliance */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-surface-400 text-sm font-medium mb-6 uppercase tracking-widest">
            Confiança de Equipes em Todo o Mundo
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-bold text-xl tracking-tighter">TECHCORP</span>
            <span className="font-bold text-xl tracking-tighter">GLOBALNET</span>
            <span className="font-bold text-xl tracking-tighter">INFRASEC</span>
            <span className="font-bold text-xl tracking-tighter">MODERN.IT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
