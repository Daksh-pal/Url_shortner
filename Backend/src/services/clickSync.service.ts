import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

const BUFFER_KEY = "clicks:buffer";
const PROCESSING_KEY = "clicks:processing";
const SYNC_INTERVAL = 30 * 1000;


export const processAndSaveBatch = async (key: string) => {
    const clickData = await redis.hgetall(key);

    const entries = Object.entries(clickData);

    if (entries.length === 0) {
        await redis.del(key);
        return;
    }

    console.log(`Flushing ${entries.length} links clicks to postgresql`);

    const updateOperations = entries.map(([shortId, clickCount]) => {
        const countNumber = Number(clickCount);
        return prisma.url.update({
            where: { shortId },
            data: { clicks: { increment: countNumber } },
        });
    });

    await prisma.$transaction(updateOperations);
    await redis.del(key);
    console.log(`✅ Successfully flushed clicks to PostgreSQL!`);
}

export const flushClicksToDb = async () => {
    try {

        const leftOverExists = await redis.exists(PROCESSING_KEY);
        if (leftOverExists) {
            console.log("🔄 Found unprocessed batch from previous run. Retrying...");
            await processAndSaveBatch(PROCESSING_KEY);
        }

        const exists = await redis.exists(BUFFER_KEY);
        if (!exists) {
            return;
        }

        await redis.rename(BUFFER_KEY, PROCESSING_KEY);
        await processAndSaveBatch(PROCESSING_KEY);



    } catch (error) {
        console.log("Error while flushing click count to DB", error);
    }
}

export const startClickSyncWorker = () => {
    console.log("Click sync worker started every 30 seconds.");
    const intervalId = setInterval(flushClicksToDb, SYNC_INTERVAL);
    const handleShutdown = async () => {
        clearInterval(intervalId);
        console.log("\n🛑 Server shutting down. Flushing remaining clicks to DB...");
        await flushClicksToDb();
        process.exit(0);
    };
    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
}