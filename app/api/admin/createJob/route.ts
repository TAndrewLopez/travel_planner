import { NextResponse } from "next/server";

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

        return NextResponse.json({ jobCreated: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An unexpected error occurred." },
            { status: 500 }
        );
    }
};
