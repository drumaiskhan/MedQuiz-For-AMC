
import React, { useState, useEffect } from 'react';
import RegistrationPortal from './components/RegistrationPortal';
import Dashboard from './components/Dashboard';
import KmuPortal from './components/KmuPortal';
import QuizContainer from './components/QuizContainer';
import ResultView from './components/ResultView';
import LoadingScreen from './components/LoadingScreen';
import { generateMedicalQuiz, generateQuizFromFile } from './services/geminiService';
import { AppStatus, UserInfo, QuizState, Question, Difficulty } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    skipped: 0,
    isFinished: false,
    answers: [],
    startTime: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('medquiz_user');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
      setStatus(AppStatus.DASHBOARD);
    }
  }, []);

  const handleLogin = (info: UserInfo) => {
    localStorage.setItem('medquiz_user', JSON.stringify(info));
    setUserInfo(info);
    setStatus(AppStatus.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('medquiz_user');
    setUserInfo(null);
    setStatus(AppStatus.IDLE);
  };

  const initQuiz = (questions: Question[]) => {
    setQuizState({
      questions,
      currentQuestionIndex: 0,
      score: 0,
      skipped: 0,
      isFinished: false,
      answers: [],
      startTime: Date.now(),
    });
    setStatus(AppStatus.QUIZ);
  };

  const startExamination = async (difficulty: Difficulty, topic: string) => {
    setStatus(AppStatus.LOADING);
    try {
      if (!userInfo) return;
      const questions = await generateMedicalQuiz(userInfo.category, userInfo.year, difficulty, topic);
      initQuiz(questions);
    } catch (err) {
      setError("AI Engine Error. Check API connection.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const progressInterval = setInterval(() => setUploadProgress(p => (p < 90 ? p + 5 : p)), 300);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const questions = await generateQuizFromFile(base64, file.type);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          initQuiz(questions);
          setIsUploading(false);
        }, 600);
      } catch (e) {
        clearInterval(progressInterval);
        setError("Extraction failed.");
        setStatus(AppStatus.ERROR);
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnswer = (answerIndex: number | null) => {
    const isSkip = answerIndex === null;
    const currentQ = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = !isSkip && answerIndex === currentQ.correctIndex;
    const newAnswers = [...quizState.answers, answerIndex];
    const isLast = quizState.currentQuestionIndex === quizState.questions.length - 1;

    if (isLast) {
      setQuizState(prev => ({
        ...prev,
        answers: newAnswers,
        score: prev.score + (isCorrect ? 1 : 0),
        skipped: prev.skipped + (isSkip ? 1 : 0),
        isFinished: true,
      }));
      setStatus(AppStatus.RESULT);
    } else {
      setQuizState(prev => ({
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        score: prev.score + (isCorrect ? 1 : 0),
        skipped: prev.skipped + (isSkip ? 1 : 0),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col items-center justify-center relative">
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen">
        {status === AppStatus.IDLE && <RegistrationPortal onEnter={handleLogin} />}
        {status === AppStatus.DASHBOARD && userInfo && (
          <Dashboard user={userInfo} onStartQuiz={startExamination} onFileUpload={handleFileUpload} onLogout={handleLogout} onOpenKmuPortal={() => setStatus(AppStatus.KMU_PORTAL)} isUploading={isUploading} uploadProgress={uploadProgress} />
        )}
        {status === AppStatus.KMU_PORTAL && userInfo && (
          <KmuPortal user={userInfo} onBack={() => setStatus(AppStatus.DASHBOARD)} onFileUpload={handleFileUpload} onLoadCommunityQuiz={initQuiz} isUploading={isUploading} uploadProgress={uploadProgress} />
        )}
        {status === AppStatus.LOADING && <LoadingScreen />}
        {status === AppStatus.QUIZ && userInfo && (
          <QuizContainer state={quizState} userInfo={userInfo} onAnswer={handleAnswer} onExit={() => setStatus(AppStatus.DASHBOARD)} />
        )}
        {status === AppStatus.RESULT && userInfo && (
          <ResultView state={quizState} userInfo={userInfo} onReset={() => setStatus(AppStatus.DASHBOARD)} onHome={() => setStatus(AppStatus.DASHBOARD)} />
        )}
        {status === AppStatus.ERROR && (
          <div className="bg-white p-16 rounded-[4rem] shadow-2xl text-center max-w-md border border-red-50">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Error</h2>
            <p className="text-slate-500 mb-10 font-medium">{error}</p>
            <button onClick={() => setStatus(AppStatus.DASHBOARD)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
