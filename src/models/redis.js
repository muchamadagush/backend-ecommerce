/* eslint-disable no-console */
/* eslint-disable camelcase */
const redisClient = require('redis').createClient;

const redisCon = redisClient(6379);

/**
 * get redis cache
 * @param {string} redis_key
 */

const get = (redis_key) => new Promise((resolve) => {
  redisCon.get(redis_key, (err, replay) => {
    if (err) {
      console.error('Redis con', err);
    } else {
      resolve({ replay });
    }
  });
});

/**
 * set redis cache
 * @param {string} redis_key
 * @param {string} redis_value
 */

const set = (redis_key, redis_value) => {
  redisCon.set(redis_key, redis_value);
};

/**
 * delete redis cache
 * @param {string} redis_key
 */

const del = (redis_key) => {
  redisCon.del(redis_key);
};

module.exports = {
  get,
  set,
  del,
};
