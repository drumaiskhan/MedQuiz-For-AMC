
export type Category = 'MBBS' | 'BDS';
export type ProfYear = '1st Prof' | '2nd Prof' | '3rd Prof' | '4th Prof' | 'Final Prof';
export type Difficulty = 'Standard' | 'Clinical' | 'Elite';

export interface UserInfo {
  name: string;
  rollNumber: string;
  category: Category;
  year: ProfYear;
  joinedAt: string;
}

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  skipped: number;
  isFinished: boolean;
  answers: (number | null)[];
  startTime: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  DASHBOARD = 'DASHBOARD',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  KMU_PORTAL = 'KMU_PORTAL'
}
