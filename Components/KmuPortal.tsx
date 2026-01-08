
import React, { useRef, useState, useEffect } from 'react';
import { UserInfo, ProfYear, Question } from '../types';
import Button from './Button';

interface KmuPortalProps {
  user: UserInfo;
  onBack: () => void;
  onFileUpload: (file: File) => void;
  onLoadCommunityQuiz: (questions: Question[]) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const YEAR_PAPERS: Record<string, string[]> = {
  '1st Prof': ['Paper A', 'Paper B', 'Paper C'],
  '2nd Prof': ['Paper D', 'Paper E', 'Paper F'],
  '3rd Prof': ['Paper G', 'Paper H', 'Paper I'],
  '4th Prof': ['Paper J', 'Paper K', 'Paper L', 'Eye', 'ENT'],
  'Final Prof': ['Paper M', 'Paper N', 'Paper O', 'Paper P', 'Paper Q']
};

const KmuPortal: React.FC<KmuPortalProps> = ({ 
  user, onBack, onLoadCommunityQuiz 
}) => {
  const [repoPath, setRepoPath] = useState(localStorage.getItem('medquiz_github_repo') || 'umaiskhan/kmu-mcqs');
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeYear, setActiveYear] = useState<ProfYear>(user.year);
  const [availablePapers, setAvailablePapers] = useState<Set<string>>(new Set());
  const [syncError, setSyncError] = useState<string | null>(null);

  const mbbsYears: ProfYear[] = ['1st Prof', '2nd Prof', '3rd Prof', '4th Prof', 'Final Prof'];
  const relevantYears = user.category === 'MBBS' ? mbbsYears : mbbsYears.slice(0, 4);

  const syncGitHub = async () => {
    setIsSyncing(true);
    setSyncError(null);
    localStorage.setItem('medquiz_github_repo', repoPath);
    try {
      const found = new Set<string>();
      const papers = YEAR_PAPERS[activeYear];
      const checks = papers.map(async (p) => {
        const url = `https://raw.githubusercontent.com/${repoPath}/main/${activeYear.toLowerCase().replace(' ', '-')}-${p.toLowerCase().replace(' ', '-')}.json`;
        const resp = await fetch(url, { method: 'HEAD' });
        if (resp.ok) found.add(`${activeYear}-${p}`);
      });
      await Promise.all(checks);
      setAvailablePapers(found);
    } catch (err) {
      setSyncError("Cloud connection refused.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => { syncGitHub(); }, [activeYear]);

  const loadFromGithub = async (paper: string) => {
    setIsSyncing(true);
    const url = `https://raw.githubusercontent.com/${repoPath}/main/${activeYear.toLowerCase().replace(' ', '-')}-${paper.toLowerCase().replace(' ', '-')}.json`;
    try {
      const response = await fetch(url);
      onLoadCommunityQuiz(await response.json());
    } catch (err) {
      setSyncError("Payload retrieval failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-[1400px] w-full flex flex-col gap-10 p-6 md:p-10 fade-in duration-700">
      <div className="bg-slate-950 p-12 md:p-20 rounded-[4rem] shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div>
            <Button onClick={onBack} variant="ghost" className="text-blue-400 mb-8 px-0">← Back to Dashboard</Button>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">KMU Digital <span className="text-blue-500">Archive</span></h1>
            <p className="text-slate-400 font-bold text-xl opacity-80 leading-relaxed max-w-xl">Global repository for verified clinical banks.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 w-full lg:w-[400px]">
            <input 
              type="text" value={repoPath} onChange={(e) => setRepoPath(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm w-full outline-none text-blue-400 mb-4"
              placeholder="github-user/repository"
            />
            <button onClick={syncGitHub} className="bg-blue-600 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Refresh Cloud</button>
            {syncError && <p className="text-[10px] text-red-400 mt-4 text-center">{syncError}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[4.5rem] shadow-xl border border-slate-50 min-h-[600px]">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 p-2 bg-slate-100 rounded-[2.5rem] w-full max-w-4xl mx-auto">
          {relevantYears.map(year => (
            <button
              key={year} onClick={() => setActiveYear(year)}
              className={`px-10 py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeYear === year ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {YEAR_PAPERS[activeYear]?.map((paper) => {
            const isCloud = availablePapers.has(`${activeYear}-${paper}`);
            return (
              <div 
                key={paper} 
                className={`p-10 rounded-[3.5rem] border-2 flex flex-col gap-8 transition-all ${
                  isCloud ? 'border-blue-50 bg-blue-50/20 hover:bg-white hover:border-blue-500' : 'opacity-40 grayscale pointer-events-none'
                }`}
              >
                <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{paper}</h4>
                <Button onClick={() => loadFromGithub(paper)} disabled={!isCloud} variant="secondary" className="w-full text-[10px] tracking-widest uppercase">Start Exam</Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KmuPortal;
