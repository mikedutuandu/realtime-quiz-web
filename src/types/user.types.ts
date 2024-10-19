
export interface IUser {
  id: number;
  name: string;
  quizUserId: string;
}

export interface ICreateUserRequest {
  name: string
  quizUserId: string
}

export interface ICreateUserResponse {
  ok: boolean
}