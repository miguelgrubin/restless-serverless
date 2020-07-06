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
  body: unknown
  headers: HeadersMap

  constructor (body: unknown, statusCode?: string, headers?: HeadersMap) {
    this.body = body
    if (headers) {
      this.headers = headers
    }
    if (statusCode) {
      this.statusCode = statusCode
    }
  }
}

export class ErrorResponse extends BaseResponse {
  statusCode = '500'
  headers : HeadersMap = baseHeaders

  body = {
    error: 'Bad Request'
  }
}

export class SuccessResponse extends BaseResponse {
  statusCode = '200'
  headers : HeadersMap = baseHeaders

  body = {}
}
