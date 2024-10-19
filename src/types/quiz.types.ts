import {IUser} from "@/types/user.types";

export interface IQuiz {
  id: number
  name: string
  participants: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeLimit: number //second
  startTime: string
  quizQuestions: IQuestion[]
}


export interface IQuestion {
  id: number
  questionText: string;
  quizQuestionOptions: IAnswer[];
}

export interface IAnswer {
  id: number
  optionText: string;
}

export interface ILeaderBoard {
  id: number
  score: number;
  quizUser: IUser
}

export interface AnswerResult {
  leaderboard: ILeaderBoard[];
}

export interface IQueryListRequest {
  limit: number
  offset: number
  filter?: any[]
  sort?: never[]
  s?: string
}

export interface IQuizListResponse {
  data: IQuiz[]
  total: number
}

export interface IQueryDetailRequest {
  id: number
}


export interface ICreateQuizSessionRequest {
  quizUserId: string
  quizId: number
}

export interface ICreateQuizSessionResponse {
  id: number
}

