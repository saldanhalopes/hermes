import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit2, Shield, UserX, UserCheck, Search, Filter } from 'lucide-react';
import { hermesApi } from '../services/api';
import { UserModal } from '../components/UserModal';

export const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const data = await hermesApi('/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: any) => {
    try {
      await hermesApi(`/users/${user.uid}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !user.active }),
      });
      fetchUsers();
    } catch (err) {
      alert('Erro ao alterar status do usuário');
    }
  };

  const handleOpenModal = (user: any = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const roles: any = {
      ADMIN: 'bg-indigo-100 text-indigo-700',
      AUDITOR: 'bg-emerald-100 text-emerald-700',
      REQUESTER: 'bg-surface-100 text-surface-600',
      IMPLEMENTER: 'bg-blue-100 text-blue-700',
      EVALUATOR: 'bg-amber-100 text-amber-700',
      CAB_MEMBER: 'bg-purple-100 text-purple-700',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${roles[role] || roles.REQUESTER}`}>
        {role.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Gerenciamento de Usuários</h1>
          <p className="text-surface-500 text-sm">Controle de acessos e cargos da organização</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Novo Usuário
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-2 text-surface-500 hover:bg-surface-100 rounded-lg">
          <Filter size={20} />
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-100 text-xs font-bold text-surface-500 uppercase tracking-wider">
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Cargo</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Criado em</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {loading ? (
              <tr><td colSpan={5} className="py-10 text-center text-surface-400">Carregando usuários...</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.uid} className="hover:bg-surface-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                      {user.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">{user.name}</p>
                      <p className="text-sm text-surface-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-500">
                  {user.createdAt?._seconds ? new Date(user.createdAt._seconds * 1000).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(user)}
                      className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(user)}
                      className={`p-1.5 rounded-md transition-all ${
                        user.active 
                          ? 'text-surface-400 hover:text-red-600 hover:bg-red-50' 
                          : 'text-surface-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={user.active ? 'Desativar' : 'Ativar'}
                    >
                      {user.active ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!loading && filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <Users size={48} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-500">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserModal 
          user={selectedUser} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchUsers();
          }} 
        />
      )}
    </div>
  );
};
