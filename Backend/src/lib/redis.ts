import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

/**
 * Production-ready Singleton Redis Client
 */
export const redis = new Redis(redisUrl, {
    // If Redis goes down, don't let commands queue indefinitely in memory.
    // Fail fast after 3 retries so our controllers can fall back to PostgreSQL.
    maxRetriesPerRequest: 3,

    // Exponential backoff strategy for reconnections
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },

    lazyConnect: false,
});

redis.on("connect", () => {
    console.log("⚡ Redis connecting...");
});

redis.on("ready", () => {
    console.log("✅ Redis connected and ready to accept commands");
});

redis.on("error", (err: Error) => {
    // CRITICAL: Catch errors so Node.js process does not crash on connection drop
    console.error("❌ Redis Error:", err.message);
});

redis.on("close", () => {
    console.warn("⚠️ Redis connection closed");
});

redis.on("reconnecting", () => {
    console.log("🔄 Redis reconnecting...");
});
