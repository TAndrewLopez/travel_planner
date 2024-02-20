import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SHA256 as sha256 } from "crypto-js";

import { createAdminToken } from "@/lib";
import { db } from "@/lib/prisma";

export const POST = async (req: Request) => {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password is required." },
                { status: 400 }
            );
        }

        const hashedPassword = sha256(password).toString();

        const user = await db.admin.findUnique({
            where: {
                email,
                password: hashedPassword,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found with provided credentials." },
                { status: 404 }
            );
        }

        const token = await createAdminToken(user.email, user.id);
        cookies().set("access_token", token);
        return NextResponse.json(
            {
                userInfo: {
                    id: user.id,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "An unexpected error occurred." },
            { status: 500 }
        );
    }
};
