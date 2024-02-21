import { Browser } from "puppeteer";
import { startLocationScraping } from "./scraping";

// NEXT.JS WILL EXECUTE THIS CODE AS SOON AS THE SERVER IS STARTED
export const register = async () => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { Worker } = await import("bullmq");
        const { db } = await import("@/lib/prisma");
        const { connection, jobsQueue } = await import("@/lib");
        const puppeteer = await import("puppeteer");
        const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_502f2743-zone-travel_planner_browser-country-us:n1b551jrqss5@brd.superproxy.io:9222';
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
                    if (job.data.jobType.type === "location") {
                        console.log("Connected! Navigating to", job.data.url);
                        await page.goto(job.data.url, { timeout: 60000 });
                        console.log("Navigated! Scraping page content...");
                        const packages = await startLocationScraping(page);
                        console.log({ packages });
                    }
                } catch (error) {
                    console.log(error);
                    await db.job.update({
                        where: {
                            id: job.data.id,
                        },
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
