import redis from 'express-redis-cache';

const redisCache = redis({
    port: 6379,               // default
    host: 'localhost',        // default
    prefix: 'r_cache',            // default
    expire: 60 * 60,                 // default
});

export default redisCache;