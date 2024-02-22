import { Browser } from "puppeteer";
import { startLocationScraping, startPackageScraping } from "./scraping";

// NEXT.JS WILL EXECUTE THIS CODE AS SOON AS THE SERVER IS STARTED
export const register = async () => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { Worker } = await import("bullmq");
        const { db } = await import("@/lib/prisma");
        const { connection, jobsQueue } = await import("@/lib");
        const puppeteer = await import("puppeteer");
        const SBR_WS_ENDPOINT =
            "wss://brd-customer-hl_502f2743-zone-travel_planner_browser-country-us:n1b551jrqss5@brd.superproxy.io:9222";
        new Worker(
            "jobsQueue",
            async (job) => {
                console.log("Connecting to Scraping Browser...");
                let browser: Browser | undefined;
                try {
                    browser = await puppeteer.connect({
                        browserWSEndpoint: SBR_WS_ENDPOINT,
                    });
                    const page = await browser.newPage();

                    console.log("Connected! Navigating to", job.data.url);
                    await page.goto(job.data.url, { timeout: 60000 });
                    console.log("Navigated! Scraping page content...");

                    if (job.data.jobType.type === "location") {
                        const packages = await startLocationScraping(page);

                        await db.job.update({
                            where: { id: job.data.id },
                            data: {
                                isComplete: true,
                                status: "complete",
                            },
                        });
                        for (const pkg of packages) {
                            const existingJob = await db.job.findFirst({
                                where: {
                                    url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                                },
                            });

                            if (!existingJob) {
                                const job = await db.job.create({
                                    data: {
                                        url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                                        jobType: { type: "package" },
                                    },
                                });
                                jobsQueue.add('package', { ...job, packageDetails: pkg })
                            }
                        }
                    } else if (job.data.jobType.type === 'package') {
                        const existingTrip = await db.trip.findUnique({
                            where: {
                                id: job.data.packageDetails.id
                            }
                        })

                        if (!existingTrip) {
                            const pkg = await startPackageScraping(page, job.data.packageDetails)
                            // await db.trip.create({ data: pkg })
                            // await db.job.update({
                            //     where: { id: job.data.id },
                            //     data: { isComplete: true, status: 'complete' }
                            // })
                        }
                    }
                } catch (error) {
                    console.log(error);
                    await db.job.update({
                        where: { id: job.data.id },
                        data: {
                            isComplete: true,
                            status: "failed",
                        },
                    });
                } finally {
                    await browser?.close();
                    console.log("Browser closed successfully.");
                }
            },
            {
                connection,
                concurrency: 10,
                removeOnComplete: { count: 1000 },
                removeOnFail: { count: 5000 },
            }
        );
    }
};
