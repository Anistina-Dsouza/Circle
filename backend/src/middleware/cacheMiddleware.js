const redisClient = require('../config/redis');

/**
 * Middleware to cache API responses using Redis
 * @param {number} duration - Time to live in seconds
 */
const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Use the request URL as the base key
      let key = `__express__${req.originalUrl || req.url}`;

      // If the user is authenticated, append their ID to the key
      // This ensures personalized feeds/data aren't leaked to other users
      if ((req.user && req.user._id) || req.userId) {
        key += `_user_${req.user?._id || req.userId}`;
      }

      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        // If data exists in Redis, return it immediately
        console.log(`[Cache Hit] Serving ${key} from Redis`);
        res.set('X-Source', 'cache');
        return res.json(JSON.parse(cachedResponse));
      } else {
        // If not in Redis, hijack res.json to store the response before sending it
        console.log(`[Cache Miss] Fetching ${key} from MongoDB`);
        res.set('X-Source', 'database');
        res.originalJson = res.json;
        res.json = (body) => {
          // Store in Redis (duration is in seconds)
          redisClient.setEx(key, duration, JSON.stringify(body));
          // Call original res.json
          res.originalJson(body);
        };
        next();
      }
    } catch (error) {
      console.error('Redis Cache Error:', error);
      // Fallback to regular response if Redis fails
      next();
    }
  };
};

module.exports = cacheMiddleware;
