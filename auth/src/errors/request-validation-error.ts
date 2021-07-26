import { ValidationError } from 'express-validator'
import { CustomError } from "./custom-error"

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]) {
    super('Error: Validation error')

    // Only because extending build in language class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map(error => {
      return { message: error.msg, field: error.param }
    })
  }
}