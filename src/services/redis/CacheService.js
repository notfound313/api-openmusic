const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });
    this._client.on('error', (error) => {
      console.error(error);
    });
    this._client.connect();
  }

  async set(key, value, expiration = 1800) {
    try {
      await this._client.set(key, JSON.stringify(value), {
        EX: expiration,
      });
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async get(key) {
    try {
      const value = await this._client.get(key);
      if (value) {
        const parsedValue = JSON.parse(value);
        return {
          data: parsedValue,
          headers: {
            'X-Data-Source': 'cache',
          },
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      await this._client.del(key);
    } catch (error) {
      console.error('Error deleting cache:', error);
    }
  }
}
module.exports = CacheService;
