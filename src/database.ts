import { createConnection, getConnection } from 'typeorm';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from 'utils/logger';

const connect = async (config: MongoConnectionOptions, options: { useMemoryServer: boolean }): Promise<void> => {
    if (options.useMemoryServer === true) {
        const mongod = new MongoMemoryServer({
            instance: {
                port: config.port,
                dbName: config.database,
            },
            autoStart: false,
        });

        await mongod.start();
    }

    await createConnection(config);
    logger.info(`Database connected. ${config.type}://${config.host}:${config.port}/${config.database}`);
};

const disconnect = async (config: MongoConnectionOptions, options?: { useMemoryServer: boolean }): Promise<void> => {
    const connection = getConnection();

    if (options.useMemoryServer === true) {
        await connection.dropDatabase();

        const mongod = new MongoMemoryServer({
            instance: {
                port: config.port,
                dbName: config.database,
            },
            autoStart: false,
        });
        await mongod.stop();
    }

    await connection.close();
    logger.info(`Database disconnected. ${config.type}://${config.host}:${config.port}/${config.database}`);
};

export { connect, disconnect };
