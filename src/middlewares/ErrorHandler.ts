import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import config from 'config';
import { logger } from 'utils/logger';

const { ENV } = config;

@Middleware({ type: 'after' })
class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: NextFunction): Response {
        let { statusCode, message } = error;

        if (statusCode === undefined) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR] as string;
        }

        if (ENV !== 'production') {
            logger.error(error);
        }

        return response.status(statusCode).send({
            code: statusCode,
            message,
            ...(ENV !== 'production' && { stack: error.stack }),
        });
    }
}

export default ErrorHandler;
