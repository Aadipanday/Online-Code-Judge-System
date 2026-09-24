import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { Submission } from "../models/submission.models.js";

const submissionWorker = new Worker(
    "submission-queue",
    async (job) => {
        console.log("Processing job:", job.id);
        console.log("Job data:", job.data);

        const submission = await Submission.findById(
            job.data.submissionId
        );

        if (!submission) {
            throw new Error("Submission not found");
        }

        console.log("Submission found:", submission._id);

        submission.status = "Running";
        await submission.save();

        // Note: Execution engine / sandbox will be added here in the future
        submission.status = "Accepted";
        await submission.save();

        return {
            success: true
        };
    },
    {
        connection: redisConnection
    }
);

submissionWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

submissionWorker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);
});

export { submissionWorker };