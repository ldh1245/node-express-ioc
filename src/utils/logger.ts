import { addLayout, configure, getLogger } from 'log4js';
import config from 'config';

const { APP_NAME, LOG_LEVEL } = config;

addLayout('json', ({ separator }) => (logEvent) => JSON.stringify(logEvent) + separator);

configure({
    appenders: {
        fileLogs: {
            type: 'dateFile',
            filename: 'logs/app.log',
            keepFileExt: true,
            daysToKeep: 3,
            pattern: '_yyyy-MM-dd',
        },
        console: { type: 'console' },
        jsonLogs: {
            type: 'stdout',
            layout: { type: 'json', separator: ',' },
        },
    },
    categories: {
        default: { appenders: ['console'], level: LOG_LEVEL },
        file: { appenders: ['fileLogs'], level: 'trace' },
        json: { appenders: ['jsonLogs'], level: 'trace' },
    },
});

const logger = getLogger(APP_NAME);

const fileLogger = getLogger('file');

const jsonLogger = getLogger('json');

export { logger, fileLogger, jsonLogger };
