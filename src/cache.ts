import { RedisClient, createClient, ClientOpts } from 'redis';
import bluebird from 'bluebird';
import { logger } from 'utils/logger';

class Cache {
    client: RedisClient;

    init(config: ClientOpts): Promise<void> {
        return new Promise((resolve, reject) => {
            const _client = createClient(config);
            bluebird.promisifyAll(_client);

            this.client = _client;

            _client.on('connect', () => {
                logger.info(`Redis connected. ${config.host}:${config.port}[${config.db}]`);
                return resolve();
            });
        });
    }
}

class AuthCache extends Cache {}
const authCache = new AuthCache();

class CommonCache extends Cache {}
const commonCache = new CommonCache();

export { authCache, commonCache };
