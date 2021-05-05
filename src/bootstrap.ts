import 'reflect-metadata';
import { Server } from 'http';
import { Container } from 'typedi';
import config from './config';
import App from './app';
import { authCache, commonCache } from './cache';
import * as database from './database';
import { logger } from 'utils/logger';

const { ENV, HOST, PORT, DATABASE, REDIS } = config;
const { AUTH_CACHE, COMMON_CACHE } = REDIS;

const bootstrap = async (): Promise<Server> => {
    try {
        /* Cache database */
        await Promise.all([authCache.init(AUTH_CACHE), commonCache.init(COMMON_CACHE)]);

        /* App server */
        const app = new App({ host: HOST, port: PORT });
        const server = app.listen();

        /* Database */
        await database.connect(DATABASE, { useMemoryServer: ENV === 'test' });

        return server;
    } catch (e) {
        logger.error(e.message);
    }
};

const destroy = async (): Promise<void> => {
    try {
        await database.disconnect(DATABASE, { useMemoryServer: ENV === 'test' });

        Container.reset();
    } catch (e) {
        logger.error(e.message);
    }
};

export { bootstrap, destroy };
