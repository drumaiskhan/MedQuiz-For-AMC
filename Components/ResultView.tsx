
import React from 'react';
import { QuizState, UserInfo } from '../types';
import Button from './Button';

interface ResultViewProps {
  state: QuizState;
  userInfo: UserInfo;
  onReset: () => void;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ state, userInfo, onReset, onHome }) => {
  const scorePct = Math.round((state.score / state.questions.length) * 100);

  return (
    <div className="max-w-[1200px] w-full flex flex-col gap-12 p-6 md:p-10 fade-in duration-1000 overflow-y-auto max-h-screen py-24 scroll-smooth">
      <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-slate-50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 bg-slate-100">
           <div className={`h-full transition-all duration-1000 ${scorePct >= 50 ? 'bg-blue-600' : 'bg-red-500'}`} style={{ width: `${scorePct}%` }}></div>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Final Examination Score</div>
        <h2 className={`text-8xl md:text-9xl font-black mb-12 ${scorePct >= 50 ? 'text-blue-600' : 'text-red-600'}`}>{state.score}/{state.questions.length}</h2>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={onReset} className="px-12 py-5">New Session</Button>
          <Button variant="outline" onClick={onHome} className="px-12 py-5">Home</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {state.questions.map((q, idx) => {
          const uIdx = state.answers[idx];
          const isCorrect = uIdx === q.correctIndex;
          return (
            <div key={idx} className={`bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl border-2 ${isCorrect ? 'border-green-50' : 'border-red-50'}`}>
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-[60%]">
                  <h4 className="text-2xl font-black text-slate-900 leading-tight mb-8">{q.question}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((o, i) => (
                      <div key={i} className={`p-5 rounded-2xl text-sm font-bold border-2 ${i === q.correctIndex ? 'border-green-500 bg-green-50 text-green-700' : i === uIdx ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-50 opacity-50'}`}>
                        {o}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:w-[40%] bg-slate-900 p-10 rounded-[2.5rem] text-white">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-4">Medical Logic</span>
                  <p className="text-slate-300 font-medium italic text-sm leading-relaxed">"{q.explanation}"</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultView;
