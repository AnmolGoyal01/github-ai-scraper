import { asyncHandler, ApiResponse, ApiError } from "../utils/index.js";
import { cache } from "../config/cache.js";
import logger from "../utils/logger.js";
import { scrapeGitHubUsers } from "../utils/scraper.js";
import { getAISummary } from "../utils/aiSummary.js";
import {
    saveUsersToDB,
    getALLUsersFromDB,
    getUserDetailsFromDB,
} from "../db/user.queries.js";

const scrapeUserListController = asyncHandler(async (req, res) => {
    logger.info(`inside scrapeUserListController`);

    const { keyword, pageCount } = req.query;
    if (!keyword) throw new ApiError(400, "keyword is required");

    // checking cache
    const cacheKey = `${keyword}_pageCount_${pageCount || 3}`;
    logger.info(`checking cache for cacheKey: ${cacheKey}...`);
    const cachedUsers = cache.get(cacheKey);
    if (cachedUsers) {
        logger.info(`cachedUsers found, length ${cachedUsers.length}`);
        return res
            .status(200)
            .json(
                new ApiResponse(200, cachedUsers, "Users fetched successfully")
            );
    }

    // scrapping users from github
    const users = await scrapeGitHubUsers(keyword, pageCount || 3);
    if (!users || users.length === 0)
        throw new ApiError(400, "Users not found");

    // getting ai summary
    const aiSummary = await getAISummary(users);
    if (aiSummary && aiSummary.length > 0) {
        users.forEach((user) => {
            const aiSummaryUser = aiSummary.find(
                (summary) => summary.username === user.username
            );
            if (aiSummaryUser) {
                user.aiSummary = aiSummaryUser;
            }
        });
    }

    logger.info(`saving users to cache...`);
    cache.set(cacheKey, users);
    saveUsersToDB(users);

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users scraped successfully"));
});

const getUsersFromDBController = asyncHandler(async (req, res) => {
    logger.info(`inside getUsersFromDBController`);
    const users = await getALLUsersFromDB();
    if (!users || users.length === 0)
        throw new ApiError(404, "Users not found");
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const getUserDetailsFromDBController = asyncHandler(async (req, res) => {
    logger.info(`inside getUserDetailsFromDB`);
    const { username } = req.params;
    const user = await getUserDetailsFromDB(username);
    if (!user) throw new ApiError(404, "User not found");
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"));
});
export {
    scrapeUserListController,
    getUsersFromDBController,
    getUserDetailsFromDBController,
};
