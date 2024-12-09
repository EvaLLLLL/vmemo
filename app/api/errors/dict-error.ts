import { BaseError } from './base-error'
import { HttpStatusCode } from 'axios'

export class DictError extends BaseError {
  constructor(
    message: string,
    public code: string,
    public status: HttpStatusCode = HttpStatusCode.BadRequest
  ) {
    super('DictError', message, code, status)
  }
}
