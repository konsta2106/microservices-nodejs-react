import { CustomError } from "./custom-error"

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor() {
    super('Error: Not found')

    // Only because extending build in language class
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [
      {
        message: 'Not found'
      }
    ]
  }
}