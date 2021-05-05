import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import ApiError from 'utils/ApiError';

@Middleware({ type: 'after' })
class NotFoundHandler implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next: NextFunction) {
        if (response.headersSent === false) {
            const apiError = new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND] as string);

            next(apiError);
        }

        next();
    }
}

export default NotFoundHandler;
