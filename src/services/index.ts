import { HTTP_STATUS } from '../constants'

type HeadersMap = Record<string, string>
const baseHeaders = {
  'Content-Type': 'application/json'
}

export class BaseService {

}

export interface Response {
  statusCode: string;
  body: unknown;
  headers: HeadersMap;
}

class BaseResponse implements Response {
  statusCode: string
  body: string
  headers: HeadersMap

  constructor (body: unknown, statusCode: string, headers?: HeadersMap) {
    this.body = JSON.stringify(body)
    this.statusCode = statusCode
    this.headers = headers || baseHeaders
  }
}

export class ErrorResponse extends BaseResponse {
  static badRequest (body: unknown) : BaseResponse {
    return new BaseResponse(body, HTTP_STATUS.badRequest)
  }
}

export class SuccessResponse extends BaseResponse {
}
