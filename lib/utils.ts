import { SignJWT } from "jose";

// TOKEN
const alg = "HS256";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const createAdminToken = async (
    email: string,
    userID: number
): Promise<string> => {
    return await new SignJWT({ email, userID, isAdmin: true })
        .setProtectedHeader({ alg })
        .setExpirationTime("48h")
        .sign(JWT_SECRET!);
};

// ERROR HANDLING
export const handleError = (error: unknown) => {
    if (error instanceof Error) {
        console.error(error.message);
        throw new Error(`Error: ${error.message}`);
    } else if (typeof error === "string") {
        console.error(error);
        throw new Error(`Error: ${error}`);
    } else {
        console.error(error);
        throw new Error(`Unknown Error: ${JSON.stringify(error)}`);
    }
};
