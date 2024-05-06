

import { Queue, Worker } from "bullmq";
import logger from "../utils/logger.js";
import { sendMail } from "../config/nodemailer.config.js";


export const redisConnection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
}

export const emailQueue = new Queue("emailQueue", {
    connection: redisConnection,
    defaultJobOptions: {
        // delay: 5000,
        removeOnComplete: true,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
})

// worker
export const emailWorker = new Worker("emailQueue", async (job) => {

    console.log("emailWorker data", job.data)
    const data = job.data
    data.map(async (item) => {
        try {
            await sendMail(item.toEmail, item.subject, item.text, item.html)
        } catch (error) {
            logger.error(error.message)
            throw new Error(error.message)
        }
    })

}, { connection: redisConnection })


emailWorker.on("completed", (job) => {
    console.log(`Job completed ${job.id}`);
})

emailWorker.on("failed", (job, err) => {
    logger.error(err.message)
    console.log(`Job failed ${job.id} with ${err.message}`);
})