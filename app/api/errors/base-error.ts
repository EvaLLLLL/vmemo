import { HttpStatusCode } from 'axios'

export class BaseError extends Error {
  constructor(
    name: string,
    message: string,
    public code: string,
    public status: HttpStatusCode = HttpStatusCode.BadRequest
  ) {
    super(message)
    this.name = name
    this.code = code
    this.status = status
  }
}
