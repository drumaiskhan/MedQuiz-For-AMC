
import React, { useState, useEffect } from 'react';
import { QuizState, UserInfo } from '../types';
import Button from './Button';

interface QuizContainerProps {
  state: QuizState;
  userInfo: UserInfo;
  onAnswer: (idx: number | null) => void;
  onExit: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ state, userInfo, onAnswer, onExit }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const q = state.questions[state.currentQuestionIndex];

  useEffect(() => {
    const itv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(itv);
  }, []);

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const progress = ((state.currentQuestionIndex) / state.questions.length) * 100;

  return (
    <div className="max-w-[1000px] w-full flex flex-col gap-8 p-6 md:p-10 fade-in duration-500">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] border border-white/50 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Module {state.currentQuestionIndex + 1}</div>
          <h3 className="text-base font-extrabold text-slate-900 truncate">{userInfo.name}</h3>
        </div>
        <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Elapsed</p>
             <div className="text-2xl font-mono font-black text-blue-600 tabular-nums">{fmt(timer)}</div>
        </div>
      </div>

      <div className="bg-white p-12 md:p-20 rounded-[4.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
           <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="min-h-[400px] flex flex-col">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-14 leading-tight tracking-tight">{q.question}</h2>
          <div className="grid grid-cols-1 gap-5">
            {q.options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => setSelected(i)} 
                className={`p-6 md:p-8 rounded-[2rem] text-left font-bold border-2 transition-all flex items-center gap-6 ${
                  selected === i ? 'border-blue-600 bg-blue-50/30 text-blue-900' : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  selected === i ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  {String.fromCharCode(65+i)}
                </div>
                <span className="text-lg md:text-xl font-bold">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <footer className="mt-16 flex items-center justify-between gap-6 pt-12 border-t border-slate-100">
          <Button variant="ghost" onClick={onExit} className="text-red-400">Abandon Exam</Button>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => { onAnswer(null); setSelected(null); }}>Skip</Button>
            <Button variant="secondary" disabled={selected === null} onClick={() => { onAnswer(selected); setSelected(null); }}>
              {state.currentQuestionIndex === state.questions.length - 1 ? 'Finalize' : 'Record & Next'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default QuizContainer;
