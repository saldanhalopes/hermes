import React, { useEffect, useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, Clock, CheckCircle2, AlertCircle, 
  TrendingUp, Users, Target, Zap, Activity,
  Download, Printer
} from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ReportService } from '../services/ReportService';

const StatCard = ({ title, value, subValue, icon: Icon, color, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 flex items-center justify-between group hover:shadow-xl hover:shadow-primary-500/10 transition-all cursor-default"
  >
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 transition-transform group-hover:scale-110`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-surface-900 leading-tight">{value}</h3>
        {subValue && <p className="text-xs font-medium text-emerald-600 mt-1">{subValue}</p>}
      </div>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
       <TrendingUp size={20} className="text-surface-300" />
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [rfcs, setRfcs] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.tenantId) return;

    const q = query(
      collection(db, 'change_requests'),
      where('tenantId', '==', profile.tenantId)
    );

    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRfcs(docs);
    });
  }, [profile]);

  const stats = useMemo(() => {
    const total = rfcs.length;
    const closed = rfcs.filter(r => r.status === 'CLOSED').length;
    const rejected = rfcs.filter(r => r.status === 'REJECTED').length;
    const successRate = total > 0 ? ((closed / (closed + rejected || 1)) * 100).toFixed(1) : 0;

    // Process Trend Data (Last 15 days)
    const last15Days = Array.from({ length: 15 }).map((_, i) => {
      const date = subDays(new Date(), i);
      const count = rfcs.filter(r => {
        const rDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return format(rDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      }).length;
      return {
        date: format(date, 'dd/MM'),
        count
      };
    }).reverse();

    // Workload (Top 3 Requesters)
    const requesters = rfcs.reduce((acc: any, r) => {
      acc[r.requesterId] = (acc[r.requesterId] || 0) + 1;
      return acc;
    }, {});
    const workloadData = Object.entries(requesters)
      .map(([name, value]) => ({ name: name.split('@')[0], value }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5);

    return {
      total,
      pending: rfcs.filter(r => ['SUBMITTED', 'UNDER_EVALUATION'].includes(r.status)).length,
      successRate: `${successRate}%`,
      critical: rfcs.filter(r => r.riskLevel === 'HIGH').length,
      trend: last15Days,
      workload: workloadData,
      byRisk: [
        { name: 'Baixo', value: rfcs.filter(r => r.riskLevel === 'LOW').length, color: '#10b981' },
        { name: 'Médio', value: rfcs.filter(r => r.riskLevel === 'MEDIUM').length, color: '#f59e0b' },
        { name: 'Alto', value: rfcs.filter(r => r.riskLevel === 'HIGH').length, color: '#ef4444' },
      ]
    };
  }, [rfcs]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary-600 mb-2"
          >
            <Activity size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Dashboard Analítico</span>
          </motion.div>
          <h2 className="text-4xl font-black text-surface-900 tracking-tight">Performance Hermes</h2>
          <p className="text-surface-500 font-medium mt-1">Análise estratégica de mudanças para <span className="text-primary-600 font-bold">{profile?.tenantId}</span>.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => ReportService.exportToCSV(rfcs, `Hermes_Dashboard_${format(new Date(), 'yyyyMMdd')}`)}
            className="px-6 py-2 bg-white text-surface-700 rounded-xl text-sm font-bold hover:bg-surface-50 transition-all flex items-center gap-2 border border-surface-200 shadow-sm"
          >
            <Download size={18} /> CSV
          </button>
          <button 
            onClick={() => ReportService.printReport()}
            className="px-6 py-2 bg-white text-surface-700 rounded-xl text-sm font-bold hover:bg-surface-50 transition-all flex items-center gap-2 border border-surface-200 shadow-sm"
          >
            <Printer size={18} /> Imprimir
          </button>
          <button className="btn-primary py-2 px-6 flex items-center gap-2">
            <Zap size={18} /> Insights IA
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de RFCs" value={stats.total} subValue="+12% este mês" icon={FileText} color="bg-indigo-600" delay={0.1} />
        <StatCard title="Gargalo (Pendentes)" value={stats.pending} subValue="Tempo médio: 2.4 dias" icon={Clock} color="bg-amber-500" delay={0.2} />
        <StatCard title="Taxa de Sucesso" value={stats.successRate} subValue="Target corporativo: 95%" icon={Target} color="bg-emerald-500" delay={0.3} />
        <StatCard title="Incidentes Críticos" value={stats.critical} subValue="Requer atenção CAB" icon={AlertCircle} color="bg-rose-500" delay={0.4} />
      </div>

      {/* Main Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Area Chart (Left 2 columns) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-surface-900">Atividade nos últimos 15 Dias</h3>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">Volume de solicitações criadas</p>
            </div>
            <select className="bg-surface-50 border-none text-xs font-bold text-surface-600 rounded-lg px-3 py-1 outline-none ring-1 ring-surface-200 focus:ring-primary-500">
              <input type="text" />
              <option>Visualizar: Últimos 15 Dias</option>
              <option>Visualizar: Último Mês</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    backgroundColor: '#1e293b', 
                    color: 'white',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                  }}
                  itemStyle={{ color: '#818cf8', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Distribution (Right column) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-lg font-black text-surface-900">Filtro por Risco</h3>
            <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">Distribuição volumétrica</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byRisk}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.byRisk.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-surface-900">{stats.total}</span>
                <span className="text-[10px] font-bold text-surface-400 uppercase">RFCs totais</span>
              </div>
            </div>
            
            <div className="w-full space-y-3 mt-6">
              {stats.byRisk.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-surface-700">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-surface-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Workload and Secondary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-surface-900">Top Solicitantes</h3>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">Volume por usuário</p>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stats.workload}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 700}} width={80} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 bg-black bg-opacity-[0.02] border-dashed border-2 border-surface-200"
        >
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center">
                <Target size={28} className="text-indigo-600" />
            </div>
            <div>
              <h4 className="text-xl font-black text-surface-900">Radar de Performance</h4>
              <p className="text-sm text-surface-500 max-w-xs mx-auto mt-2">
                O tenant <span className="text-primary-600 font-bold">{profile?.tenantId}</span> está mantendo uma estabilidade operacional <span className="text-emerald-600 font-bold">Acima da Média</span> este mês.
              </p>
            </div>
            <button className="px-8 py-3 bg-white text-surface-900 rounded-2xl text-sm font-black shadow-lg shadow-surface-200 hover:scale-105 transition-transform">
              Ver Relatório Detalhado
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
