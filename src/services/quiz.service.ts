import {Request} from '@/helpers/fetch-wrapper'
import {
    ICreateQuizSessionRequest, ICreateQuizSessionResponse,
    IQueryDetailRequest,
    IQueryListRequest,
    IQuiz,
    IQuizListResponse,
} from '@/types'

export const getQuizListApi = (payload: IQueryListRequest) => {
  return Request.call<IQuizListResponse>({
    url: '/quiz.list',
    method: 'POST',
    data: payload,
  })
}

// export const getQuizListApi = (payload: IQueryListRequest) => {
//     // Simulating the API call
//     return new Promise<IQuizListResponse>((resolve) => {
//         setTimeout(() => {
//             const allLobbies: IQuiz[] = [
//                 {
//                     id: 1,
//                     timeLimit: 10,
//                     name: 'General Knowledge',
//                     participants: 10,
//                     startTime: '2:00 PM',
//                     difficulty: 'Easy',
//                     quizQuestions: []
//                 },
//                 {
//                     id: 2,
//                     timeLimit: 300,
//                     name: 'Science Quiz',
//                     participants: 15,
//                     startTime: '3:30 PM',
//                     difficulty: 'Medium',
//                     quizQuestions: []
//                 },
//                 {
//                     id: 3,
//                     timeLimit: 300,
//                     name: 'History Trivia',
//                     participants: 8,
//                     startTime: '4:15 PM',
//                     difficulty: 'Hard',
//                     quizQuestions: []
//                 },
//                 {
//                     id: 4,
//                     timeLimit: 300,
//                     name: 'Pop Culture',
//                     participants: 12,
//                     startTime: '5:00 PM',
//                     difficulty: 'Medium',
//                     quizQuestions: []
//                 },
//                 {
//                     id: 5,
//                     timeLimit: 300,
//                     name: 'Sports Fanatics',
//                     participants: 20,
//                     startTime: '6:30 PM',
//                     difficulty: 'Hard',
//                     quizQuestions: []
//                 },
//                 {
//                     id: 6,
//                     timeLimit: 300,
//                     name: 'Music Maestros',
//                     participants: 18,
//                     startTime: '7:00 PM',
//                     difficulty: 'Medium',
//                     quizQuestions: []
//                 },
//                 {
//                     id: 7,
//                     timeLimit: 300,
//                     name: 'Movie Buffs',
//                     participants: 25,
//                     startTime: '8:00 PM',
//                     difficulty: 'Easy',
//                     quizQuestions: []
//                 },
//                 {
//                     id: 8,
//                     timeLimit: 300,
//                     name: 'Literature Lovers',
//                     participants: 14,
//                     startTime: '9:00 PM',
//                     difficulty: 'Hard',
//                     quizQuestions: []
//                 },
//             ];
//
//             const paginatedLobbies = allLobbies.slice(payload.offset, payload.offset + payload.limit);
//
//             const response: IQuizListResponse = {
//                 data: paginatedLobbies,
//                 total: allLobbies.length,
//             };
//
//             resolve(response);
//         }, 500); // Simulate network delay
//     });
// }

export const getQuizByIdApi = (payload: IQueryDetailRequest) => {
    return Request.call<IQuiz>({
        url: '/quiz.detail',
        method: 'POST',
        data: payload,
    })
}
// export const getQuizByIdApi = (quizId: number) => {
//     return new Promise<IQuiz>((resolve) => {
//         setTimeout(() => {
//             const quiz: IQuiz = {
//                 id: quizId,
//                 name: "Science Quiz",
//                 participants: 15,
//                 difficulty: 'Medium',
//                 timeLimit: 10,
//                 startTime: "3:30 PM",
//                 quizQuestions: [
//                     {
//                         id: 1,
//                         questionText: "What is the capital of France?",
//                         quizQuestionOptions: [
//                             {id: 1, optionText: "New York"},
//                             {id: 2, optionText: "London"},
//                             {id: 3, optionText: "Paris"},
//                             {id: 4, optionText: "Dublin"},
//                         ],
//                     },
//                     {
//                         id: 2,
//                         questionText: "Who is CEO of Tesla?",
//                         quizQuestionOptions: [
//                             {id: 5, optionText: "Jeff Bezos"},
//                             {id: 6, optionText: "Elon Musk"},
//                             {id: 7, optionText: "Bill Gates"},
//                             {id: 8, optionText: "Tony Stark"},
//                         ],
//                     },
//                     {
//                         id: 3,
//                         questionText: "The iPhone was created by which company?",
//                         quizQuestionOptions: [
//                             {id: 9, optionText: "Apple"},
//                             {id: 10, optionText: "Intel"},
//                             {id: 11, optionText: "Amazon"},
//                             {id: 12, optionText: "Microsoft"},
//                         ],
//                     },
//                 ]
//             };
//             resolve(quiz);
//         }, 400);
//     });
// }

export const createQuizSessionApi = (payload: ICreateQuizSessionRequest) => {
    return Request.call<ICreateQuizSessionResponse>({
        url: '/quiz.session.create',
        method: 'POST',
        data: payload,
    })
}

// export const createQuizSessionApi = (payload: ICreateQuizSessionRequest) => {
//     console.log(payload)
//     return new Promise<ICreateQuizSessionResponse>((resolve) => {
//         setTimeout(() => {
//             const res: ICreateQuizSessionResponse = {
//                 id: 100
//             }
//             resolve(res);
//         }, 300);
//     });
// }

