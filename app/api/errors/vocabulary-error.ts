import { BaseError } from './base-error'
import { HttpStatusCode } from 'axios'

export class VocabularyError extends BaseError {
  constructor(
    message: string,
    public code: string,
    public status: HttpStatusCode = HttpStatusCode.BadRequest
  ) {
    super('VocabularyError', message, code, status)
  }
}
