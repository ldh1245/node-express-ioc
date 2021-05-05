import { Server } from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers';
import { useContainer as useOrmContainer } from 'typeorm';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { Container } from 'typeorm-typedi-extensions';
import { ErrorConverter, ErrorHandler, NotFoundHandler } from './middlewares';
import { logger } from './utils/logger';

import v1Controllers from './api/v1';

/**
 * TODO
 * 3. Validation Middlware
 * 4. typeorm migration
 *
 * class-validator를 통해 검증 후 middleware로 바로 넘길려면 @Body, @Param 등으로 바로 받아야함.
 * 여기서 header나 cookie 등을 설정해야 하는 경우 res 객체를 사용해야 하는데 @Res까지 사용하면서 지저분해짐.
 * 그래서 statusCode가 2XX일 경우, Response 객체를 세팅하나 미들웨어를 두면 깔끔해질거 같음.
 */

class App {
    app: express.Application;
    host: string;
    port: number;

    constructor({ host, port }: { host: string; port: number }) {
        this.app = express();
        this.host = host;
        this.port = port;

        this.configureMiddleware();
        this.configureContainer();
        this.configureSwagger();
        this.configureRoutes();
    }

    configureMiddleware(): void {
        // set CORS headers
        this.app.use(cors({ origin: '*', allowedHeaders: ['X-Request-With'] }));

        // set security HTTP headers
        this.app.use(helmet());

        // parse json request body
        this.app.use(express.json());

        // parse urlencoded request body
        this.app.use(express.urlencoded({ extended: true }));
    }

    configureContainer(): void {
        // set container to routing-controllers
        useContainer(Container);
        // set container to typeorm
        useOrmContainer(Container);
    }

    configureSwagger(): void {
        const storage = getMetadataArgsStorage();
        const schemas = validationMetadatasToSchemas();
        const spec = routingControllersToSpec(
            storage,
            {
                controllers: [...v1Controllers],
            },
            {
                info: {
                    title: 'My API',
                    version: '1.0.0',
                },
                components: { schemas },
            },
        );

        this.app.use('/swagger-apis', swaggerUi.serve, swaggerUi.setup(spec));
    }

    configureRoutes(): void {
        useExpressServer(this.app, {
            controllers: [...v1Controllers],
            middlewares: [NotFoundHandler, ErrorConverter, ErrorHandler],
            defaultErrorHandler: false,
        });
    }

    listen(): Server {
        return this.app.listen(this.port, () => {
            logger.info(`Server running at ${this.host}:${this.port}.`);
        });
    }
}

export default App;
