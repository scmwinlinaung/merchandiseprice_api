const { createClient } = require('redis');

// Create a Redis client, defaults to localhost:6379
const redisClient = createClient(); 

// Handle Redis client errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis (required for Redis v4+)
async function connectRedis() {
	await redisClient.connect(); // Connect to Redis server
}

async function terminateRedis() {
	await redisClient.quit(); 
}

// Cache data (set with an expiration time)
async function setCache(key, value, ttl = 3600) { // Default TTL of 1 hour
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value)); // Set value with expiration time
    console.log(`Cache set for ${key} with TTL of ${ttl} seconds.`);
  } catch (err) {
    console.error('Error setting cache:', err);
  }
}

// Get data from cache
async function getCache(key) {
  try {
    const cachedData = await redisClient.get(key); // Retrieve cache by key
    if (cachedData) {
      console.log(`Cache hit for ${key}`);
      return JSON.parse(cachedData); // Parse the cached JSON data
    } else {
      console.log(`Cache miss for ${key}`);
      return null; // No cached data found
    }
  } catch (err) {
    console.error('Error getting cache:', err);
    return null;
  }
}

// Delete cache key
async function deleteCache(key) {
  try {
    await redisClient.del(key); // Remove cache by key
    console.log(`Cache deleted for ${key}`);
  } catch (err) {
    console.error('Error deleting cache:', err);
  }
}

// Example to clear all cache
async function clearAllCache() {
  try {
    await redisClient.flushAll(); // Delete all keys in the Redis database
    console.log('All cache cleared');
  } catch (err) {
    console.error('Error clearing all cache:', err);
  }
}

// Export the functions
module.exports = {
  redisClient,
  setCache,
  getCache,
  deleteCache,
  clearAllCache,
  connectRedis,
  terminateRedis
};
