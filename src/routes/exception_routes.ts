import {NextFunction, Request, Response} from "express";
import BusinessException from "../model/BusinessException";

export function businessException(error: BusinessException, request: Request, response: Response, next: NextFunction) {
  response.status(error.status)
  .json({
    "status": error.status,
    "errorMessage": error.message
  })
  next();
}

export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  response.status(500)
  .json({
    "status": 500,
    "errorMessage": "Internal Server Error"
  })
  next();
}