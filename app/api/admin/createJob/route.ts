import { NextResponse } from "next/server";

import { jobsQueue } from "@/lib";
import { db } from "@/lib/prisma";

export const POST = async (req: Request) => {
    try {
        const { url, jobType } = await req.json();

        const response = await db.job.create({
            data: {
                url,
                jobType,
            },
        });

        await jobsQueue.add('new location', { url, jobType, id: response.id })

        return NextResponse.json({ jobCreated: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An unexpected error occurred." },
            { status: 500 }
        );
    }
};
