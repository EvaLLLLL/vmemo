import { BaseError } from './base-error'
import { HttpStatusCode } from 'axios'

export class MemoryError extends BaseError {
  constructor(
    message: string,
    public code: string,
    public status: HttpStatusCode = HttpStatusCode.BadRequest
  ) {
    super('MemoryError', message, code, status)
  }
}
