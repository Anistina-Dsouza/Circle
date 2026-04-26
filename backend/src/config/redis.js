const redis = require('redis');

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis Cloud successfully');
  });

  // Immediately connect
  (async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  })();
} else {
  console.log('No REDIS_URL provided. Using dummy Redis client (cache disabled).');
  redisClient = {
    get: async () => null,
    set: async () => null,
    setEx: async () => null,
    del: async () => null,
    on: () => {},
    connect: async () => {}
  };
}

module.exports = redisClient;
