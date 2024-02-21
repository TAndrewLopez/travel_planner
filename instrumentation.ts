// NEXT.JS WILL EXECUTE THIS CODE AS SOON AS THE SERVER IS STARTED
export const register = async () => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { Worker } = await import("bullmq");
        const { connection, jobsQueue } = await import('@/lib')

        new Worker("jobsQueue", async (job) => {
            console.log({ job })
        }, {
            connection,
            concurrency: 10,
            removeOnComplete: { count: 1000 },
            removeOnFail: { count: 5000 },
        });
    }
};
