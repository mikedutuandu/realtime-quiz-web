import {Request} from '@/helpers/fetch-wrapper'
import {ICreateUserRequest, ICreateUserResponse} from '@/types'

export const createUserApi = (payload: ICreateUserRequest) => {
  return Request.call<ICreateUserResponse>({
    url: '/quiz.user.create',
    method: 'POST',
    data: payload,
  })
}


// export const createUserApi = (payload: ICreateUserRequest) => {
//   console.log(payload)
//   return new Promise<ICreateUserResponse>((resolve) => {
//     setTimeout(() => {
//       const res: ICreateUserResponse = {
//         ok: true
//       }
//       resolve(res);
//     }, 300);
//   });
// }