const redis = require("redis");
const { promisify } = require("util");
const { REDIS_URL, OTP_DURATION } = require("../core/config");

const redisClient = redis.createClient(REDIS_URL);
const getAsync = promisify(redisClient.get).bind(redisClient);

exports.cacheData = (key, value, expirationTime = OTP_DURATION) => {
  redisClient.setex(key, expirationTime, value);
};

exports.getCachedData = async (key) => {
  return await getAsync(key);
};
