import { NextResponse } from 'next/server'
import { HttpStatusCode } from 'axios'

interface ResponseBody<T = unknown> {
  message: string
  data?: T
  code?: string
  status?: number
}

export class ApiResponse<T = unknown> extends NextResponse {
  private constructor(body: ResponseBody<T>, init?: ResponseInit) {
    super(JSON.stringify(body), {
      ...init,
      status: init?.status ?? HttpStatusCode.Ok,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json'
      }
    })
  }

  static success<T>(
    data?: T,
    message: string = 'Success',
    init?: ResponseInit
  ): ApiResponse<T> {
    return new ApiResponse<T>(
      {
        message,
        data,
        status: HttpStatusCode.Ok
      },
      init
    )
  }

  static created<T>(
    data?: T,
    message: string = 'Created',
    init?: ResponseInit
  ): ApiResponse<T> {
    return new ApiResponse<T>(
      {
        message,
        data,
        status: HttpStatusCode.Created
      },
      init
    )
  }

  static apiError(
    message: string,
    code: string = 'INTERNAL_ERROR',
    status: number = HttpStatusCode.InternalServerError,
    init?: ResponseInit
  ): ApiResponse {
    return new ApiResponse(
      {
        message,
        code,
        status
      },
      { ...init, status }
    )
  }

  static badRequest(
    message: string,
    code: string = 'BAD_REQUEST'
  ): ApiResponse {
    return this.apiError(message, code, HttpStatusCode.BadRequest)
  }

  static unauthorized(): ApiResponse {
    return this.apiError(
      'Unauthorized',
      'UNAUTHORIZED',
      HttpStatusCode.Unauthorized
    )
  }

  static notFound(message: string = 'Not Found'): ApiResponse {
    return this.apiError(message, 'NOT_FOUND', HttpStatusCode.NotFound)
  }
}
