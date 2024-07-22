/**
 * @file ErrorHelper.ts
 * @version 1.0.0
 * @name ErrorHelper
 * @description This file contains the ErrorHelper class which provides methods for handling and logging errors.
 * @author [Kizito Mrema]
 */

import winston from "winston";
import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  // Export CustomError
  statusCode?: number;
}

/**
 * Helper class for error handling and logging.
 */
class ErrorHelper {
  private logger: winston.Logger;

  /**
   * Create a new instance of ErrorHelper.
   */
  constructor() {
    // Define a Winston logger instance
    this.logger = winston.createLogger({
      level: "error",
      format: winston.format.json(),
      defaultMeta: { service: "express-app" },
      transports: [
        new winston.transports.File({ filename: "./logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "./logs/info.log", level: "info" }),
        new winston.transports.Console({ level: "info" }),
      ],
    });
  }

  /**
   * Error handler middleware to log errors and send appropriate responses.
   * @param {CustomError} err The error object.
   * @param {Request} req The Express request object.
   * @param {Response} res The Express response object.
   * @param {NextFunction} next The next middleware function.
   */
  handleError(err: CustomError, req: Request, res: Response, next: NextFunction) {
    // Log the error details
    this.logger.error(
      `${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );

    // Respond to the client
    if (!res.headersSent) {
      res
        .status(err.statusCode || 500)
        .json({ success: false, message: err.message, payload: null });
    } else {
      next(err);
    }
  }
}

export default ErrorHelper;
