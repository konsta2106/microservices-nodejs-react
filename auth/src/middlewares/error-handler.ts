import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors/custom-error'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    console.log(err.message)
    return res.status(err.statusCode).send({
      status: err.statusCode,
      errors: err.serializeErrors()}) 
  }
  res.status(400).send({
    status: 400,
    errors: [
      {
        message: 'Unknown error'
      }
    ]
  })
}