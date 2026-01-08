
import React from 'react';

const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12 max-w-lg w-full text-center">
    <div className="relative mb-16">
      <div className="w-32 h-32 bg-blue-600/10 rounded-full absolute animate-ping"></div>
      <div className="w-32 h-32 bg-white shadow-2xl rounded-[2.5rem] relative z-10 flex items-center justify-center border border-slate-50">
         <div className="w-16 h-16 border-[6px] border-slate-50 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
    <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Diagnostic Core</h2>
    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] animate-pulse mt-4">Synthesizing Exam Modules</p>
  </div>
);

export default LoadingScreen;
