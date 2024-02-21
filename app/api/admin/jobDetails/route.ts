import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
        const jobs = await db.job.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        const activeJobs = await db.job.findMany({
            where: {
                isComplete: false,
            },
        });

        return NextResponse.json({
            jobs,
            activeJobs: activeJobs.length ?? 0,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "An unexpected error occurred." },
            { status: 500 }
        );
    }
};
