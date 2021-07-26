import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Connection error from data base'
  constructor() {
    super('Error: Error connectiong to DB')

    // Only because extending build in language class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      {
        message: this.reason
      }
    ]
  }
}