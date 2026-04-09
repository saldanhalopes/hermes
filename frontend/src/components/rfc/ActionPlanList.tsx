import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, User } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

interface ActionPlanListProps {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  readOnly?: boolean;
  canToggleStatus?: boolean;
}

export const ActionPlanList: React.FC<ActionPlanListProps> = ({ tasks, onChange, readOnly, canToggleStatus }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      completed: false,
    };
    onChange([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const removeTask = (id: string) => {
    if (readOnly) return;
    onChange(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    if (readOnly && !canToggleStatus) return;
    onChange(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
          />
          <button
            onClick={addTask}
            className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-surface-100 rounded-2xl text-center">
            <p className="text-sm text-surface-400 font-medium">Nenhuma tarefa definida no plano de ação.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                task.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-surface-100 hover:border-primary-100 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleTask(task.id)}
                  disabled={readOnly && !canToggleStatus}
                  className={`transition-colors ${task.completed ? 'text-emerald-500' : 'text-surface-300 hover:text-primary-500'}`}
                >
                  {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${task.completed ? 'text-emerald-700 line-through' : 'text-surface-900'}`}>
                    {task.title}
                  </p>
                  {task.assignedTo && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                      <User size={10} /> {task.assignedTo}
                    </div>
                  )}
                </div>
              </div>
              
              {!readOnly && (
                <button
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between">
          <div className="w-full bg-surface-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
            />
          </div>
          <span className="ml-4 text-[10px] font-black text-surface-400 uppercase tracking-widest whitespace-nowrap">
            {tasks.filter(t => t.completed).length} / {tasks.length} Concluído
          </span>
        </div>
      )}
    </div>
  );
};
