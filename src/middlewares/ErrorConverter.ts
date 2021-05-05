import httpStatus from 'http-status';
import { NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import ApiError from 'utils/ApiError';

@Middleware({ type: 'after' })
class ErrorConverter implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: NextFunction): void {
        const isApiError = error instanceof ApiError;

        if (isApiError === true) {
            return next(error);
        }

        const statusCode = error.httpCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

        const apiError = new ApiError(statusCode, message, error.stack);

        return next(apiError);
    }
}

export default ErrorConverter;
