import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async (retries = 7, delay = 3000) => {
    while (retries > 0) {
        try {
            await prisma.$connect();
            console.log("Database connected successfully");
            break;
        } catch (error) {
            console.error("Failed to connect to the database:", error);
            retries--;
            console.log(`Retrying... attempts left: ${retries}`);
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    if (retries === 0) {
        throw new Error(
            "Could not connect to the database after multiple attempts."
        );
    }
};
export default prisma;
