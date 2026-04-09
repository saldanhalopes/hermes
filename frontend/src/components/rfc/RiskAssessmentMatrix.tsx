import React from 'react';
import { Shield, DollarSign, Activity, Users } from 'lucide-react';

interface ImpactScore {
  category: string;
  score: number;
}

interface RiskAssessmentMatrixProps {
  scores: ImpactScore[];
  onChange?: (scores: ImpactScore[]) => void;
  readOnly?: boolean;
}

const CATEGORIES = [
  { id: 'security', label: 'Segurança', icon: <Shield size={16} />, description: 'Risco de vazamento ou acesso indevido' },
  { id: 'financial', label: 'Financeiro', icon: <DollarSign size={16} />, description: 'Custo de implementação e risco de perda' },
  { id: 'operational', label: 'Operacional', icon: <Activity size={16} />, description: 'Impacto na disponibilidade do serviço' },
  { id: 'ux', label: 'Usuário', icon: <Users size={16} />, description: 'Impacto na experiência e satisfação' },
];

export const RiskAssessmentMatrix: React.FC<RiskAssessmentMatrixProps> = ({ scores, onChange, readOnly }) => {
  const handleScoreChange = (categoryId: string, score: number) => {
    if (readOnly || !onChange) return;
    const newScores = [...scores];
    const index = newScores.findIndex(s => s.category === categoryId);
    if (index >= 0) {
      newScores[index].score = score;
    } else {
      newScores.push({ category: categoryId, score });
    }
    onChange(newScores);
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return 'bg-emerald-500 text-white';
    if (score === 3) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  const getFinalScore = () => {
    if (scores.length === 0) return 0;
    return (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => {
          const currentScore = scores.find(s => s.category === cat.id)?.score || 0;
          return (
            <div key={cat.id} className="p-4 rounded-2xl bg-surface-50 border border-surface-100 transition-all hover:bg-white hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg text-primary-600 shadow-sm">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-surface-900">{cat.label}</h4>
                  <p className="text-[10px] text-surface-400">{cat.description}</p>
                </div>
              </div>
              
              <div className="flex gap-1.5 mt-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    disabled={readOnly}
                    onClick={() => handleScoreChange(cat.id, val)}
                    className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentScore === val 
                        ? getScoreColor(val) 
                        : 'bg-white text-surface-400 hover:bg-surface-100 border border-surface-100'
                    } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-surface-900 text-white flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold opacity-70">Impacto Médio Calculado</h3>
          <p className="text-2xl font-black">{getFinalScore()}</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
          parseFloat(getFinalScore()) >= 4 ? 'bg-rose-500' : parseFloat(getFinalScore()) >= 2.5 ? 'bg-amber-500' : 'bg-emerald-500'
        }`}>
          {parseFloat(getFinalScore()) >= 4 ? 'Alto Risco' : parseFloat(getFinalScore()) >= 2.5 ? 'Risco Médio' : 'Baixo Risco'}
        </div>
      </div>
    </div>
  );
};
