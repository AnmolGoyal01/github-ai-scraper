import prisma from "./prismaClient.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/index.js";

export const formatUsersToSaveInDB = (users, withSummary = false) => {
    return users.map((user) => ({
        username: user.username,
        displayName: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        profileUrl: user.profileUrl,
        pinnedRepos: JSON.stringify(user.pinnedRepos) || "",
        contributions: Number(user.contributions || 0),
        aiSummary: JSON.stringify(user.aiSummary) || "",
    }));
};

export const saveUsersToDB = async (users) => {
    logger.info(`Saving ${users?.length} users to DB`);
    if (!users || users.length === 0)
        throw new ApiError(404, "Users not found");

    const formattedUsers = formatUsersToSaveInDB(users);

    try {
        const savedUsers = await prisma.userProfile.createMany({
            data: formattedUsers,
            skipDuplicates: true,
        });
        if (!savedUsers) throw new ApiError(500, "Failed to save users to DB");
        logger.info(
            `Saved ${savedUsers?.count} users to DB after skipping duplicates`
        );
        return savedUsers;
    } catch (error) {
        logger.error(`Failed to save users to DB: ${error}`);
    }
};

export const getALLUsersFromDB = async () => {
    logger.info("Fetching users from DB");
    try {
        const users = await prisma.userProfile.findMany();
        if (!users) throw new ApiError(404, "Users not found");
        const formattedUsers = users.map((user) => ({
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            location: user.location,
            profileUrl: user.profileUrl,
            pinnedRepos: JSON.parse(user.pinnedRepos),
            contributions: user.contributions,
            aiSummary: JSON.parse(user.aiSummary) || {},
        }));
        logger.info(`Fetched ${users?.length} users from DB`);
        return formattedUsers;
    } catch (error) {
        logger.error(`Failed to fetch users from DB: ${error}`);
        throw new ApiError(500, "Failed to fetch users from DB");
    }
};

export const getUserDetailsFromDB = async (username) => {
    logger.info(`Fetching user details from DB for username: ${username}`);
    try {
        const user = await prisma.userProfile.findUnique({
            where: { username },
        });
        if (!user) throw new ApiError(404, "User not found");
        const formattedUser = {
            username: user.username,
            displayName: user.displayName,
            bio: user.bio,
            location: user.location,
            profileUrl: user.profileUrl,
            pinnedRepos: JSON.parse(user.pinnedRepos) || [],
            contributions: user.contributions,
            aiSummary: JSON.parse(user.aiSummary) || {},
        };
        logger.info(`Fetched user details from DB for username: ${username}`);
        return formattedUser;
    } catch (error) {
        logger.error(`Failed to fetch user details from DB: ${error}`);
        throw new ApiError(500, "Failed to fetch user details from DB");
    }
};
