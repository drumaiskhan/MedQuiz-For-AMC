
import React, { useState } from 'react';
import { Category, ProfYear, UserInfo } from '../types';
import Button from './Button';

interface RegistrationPortalProps {
  onEnter: (info: UserInfo) => void;
}

const RegistrationPortal: React.FC<RegistrationPortalProps> = ({ onEnter }) => {
  const [category, setCategory] = useState<Category>('MBBS');
  const [year, setYear] = useState<ProfYear>('1st Prof');
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');

  const mbbsYears: ProfYear[] = ['1st Prof', '2nd Prof', '3rd Prof', '4th Prof', 'Final Prof'];
  const bdsYears: ProfYear[] = ['1st Prof', '2nd Prof', '3rd Prof', 'Final Prof'];
  const years = category === 'MBBS' ? mbbsYears : bdsYears;

  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && roll) onEnter({ name, rollNumber: roll, category, year, joinedAt: new Date().toISOString() });
  };

  return (
    <div className="max-w-[1100px] w-full flex flex-col lg:flex-row bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-50 min-h-[700px] fade-in duration-1000">
      {/* Branding Side */}
      <div className="lg:w-[45%] bg-slate-900 p-16 text-white flex flex-col justify-between relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-12 shadow-2xl animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
          </div>
          <h1 className="text-6xl font-black mb-6 tracking-tighter leading-[0.9]">MedQuiz<br/><span className="text-blue-500">Expert.</span></h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-sm">The digital frontier for clinical examination and neural paper synthesis.</p>
        </div>
        
        <div className="relative z-10 pt-10 border-t border-white/10 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-blue-400">UK</div>
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Architecture By</p>
            <h3 className="text-lg font-bold">Umais Khan</h3>
            <p className="text-xs text-slate-500 font-medium">Ayub Medical College</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="lg:w-[55%] p-16 lg:p-24 flex flex-col justify-center bg-white">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Identity Entry</h2>
          <p className="text-slate-400 font-medium">Initialize your professional medical profile.</p>
        </div>

        <form onSubmit={sub} className="space-y-8">
          <div className="p-1.5 bg-slate-100 rounded-[1.5rem] border border-slate-200/50 flex">
            {(['MBBS', 'BDS'] as Category[]).map(c => (
              <button 
                key={c} type="button" onClick={() => setCategory(c)} 
                className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${category === c ? 'bg-white text-blue-600 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5">
            <input 
              type="text" placeholder="Full Candidate Name" required value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-slate-50 p-6 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white font-bold transition-all shadow-inner" 
            />
            <input 
              type="text" placeholder="Institutional Roll Number" required value={roll} 
              onChange={(e) => setRoll(e.target.value)} 
              className="w-full bg-slate-50 p-6 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white font-bold transition-all shadow-inner" 
            />
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Academic Stage</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {years.map(y => (
                <button 
                  key={y} type="button" onClick={() => setYear(y)} 
                  className={`py-4 rounded-2xl text-[10px] font-black transition-all border-2 ${year === y ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg' : 'border-slate-50 text-slate-400 bg-slate-50 hover:border-slate-200'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="secondary" className="w-full py-6 text-sm uppercase tracking-[0.2em] mt-8 shadow-2xl">Initialize Portal Session</Button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPortal;
