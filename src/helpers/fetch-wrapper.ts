import BaseAxios, { AxiosInstance } from 'axios'
import _ from 'lodash'
import { alert } from './utils'
const HIDE_MESSAGE_ERROR_CODES = [404, 500, 9999]

export type IRequestResponse<ResponseObj> = {
  apiStatus: 0 | 1
  errorStatus?: any
  message?: any
} & ResponseObj extends infer U
  ? { [K in keyof U]: U[K] }
  : never

class RequestClass {
  axios: AxiosInstance
  constructor() {
    this.axios = BaseAxios.create({ timeout: 60000 })
  }
  async call<ResponseObj>(config: {
    url: string
    method: string
    data?: any
    serverBaseUrl?: string
    headers?: any
    session?: {
      accessToken?: string
    }
  }) {
    try {
      const serverBaseUrl =
        config.serverBaseUrl || process.env.NEXT_PUBLIC_API_HOST

      if (!config.headers) {
        config = {
          ...config,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      }

      const res = await this.axios.request({
        baseURL: serverBaseUrl,
        ...config,
      })

      return { ...res.data, apiStatus: 1 } as IRequestResponse<ResponseObj>
    } catch (error) {
      const errorStatus: any = _.get(error, 'response.status', null)
      const data: any = _.get(error, 'response.data', {}) || {}

      if (
        HIDE_MESSAGE_ERROR_CODES.includes(errorStatus) ||
        HIDE_MESSAGE_ERROR_CODES.includes(data?.code) ||
        !data.message
      ) {
        data.message = 'Oops, Something Went Wrong'
      }
      if (_.get(error, 'message') === 'Network Error') {
        data.message = 'Network Error'
        data.code = 444
      }

      return {
        ...data,
        apiStatus: 0,
        errorStatus,
      } as unknown as IRequestResponse<ResponseObj>
    }
  }
}

export const Request = new RequestClass()

export const handleResponse = ({
  response,
  successMessage,
}: {
  response: IRequestResponse<any>
  successMessage?: string
}) => {
  if (!response.apiStatus && response.message) {
    if (Array.isArray(response.message)) {
      response.message.forEach((message: string) => alert.error(message))
    } else {
      alert.error(response.message)
    }
  } else {
    if (successMessage) {
      alert.success(successMessage)
    }
  }
}