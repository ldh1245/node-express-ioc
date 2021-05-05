import dotenv from 'dotenv';
import { ClientOpts } from 'redis';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

const env: string = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${env}` });

type BaseConfig = {
    ENV: string;
    APP_NAME: string;
    HOST: string;
    PORT: number;
    LOG_LEVEL: string;
    DATABASE: MongoConnectionOptions;
    REDIS: Record<'AUTH_CACHE' | 'COMMON_CACHE', ClientOpts>;
};

type Config = {
    [key: string]: string;
};

const baseConfig: BaseConfig = {
    ENV: env,
    APP_NAME: process.env.APP_NAME || 'App',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: Number(process.env.PORT),
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DATABASE: {
        type: 'mongodb',
        url: '',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        synchronize: true,
        logging: false,
        entities: ['src/entity/**/*.ts'],
        migrations: ['src/migration/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber',
        },
    },
    REDIS: {
        AUTH_CACHE: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            db: 0,
            password: process.env.REDIS_PASS,
        },
        COMMON_CACHE: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            db: 1,
            password: process.env.REDIS_PASS,
        },
    },
};

const envConfig: Record<string, Config> = {
    /* PROD */
    production: {},
    /* DEV */
    development: {},
    /* LOCAL */
    local: {},
    /* TEST */
    test: {},
};

export default Object.assign(baseConfig, envConfig);
