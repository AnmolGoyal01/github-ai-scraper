import { Router } from "express";
import {
    scrapeUserListController,
    getUsersFromDBController,
    getUserDetailsFromDBController,
} from "../controllers/scraper.controllers.js";

const router = Router();

/**
 * @swagger
 * /api/v1/scrape:
 *   get:
 *     summary: Scrape GitHub users by keyword using Gemini AI
 *     description: Uses Gemini 2.0 Flash Lite AI to enhance scraping results.
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search GitHub users
 *       - in: query
 *         name: pageCount
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of pages to scrape
 *     responses:
 *       200:
 *         description: Successful scraping result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: List of scraped GitHub users
 *                 message:
 *                   type: string
 *                   example: Users scraped successfully
 *       500:
 *         description: Server error
 */
router.route("/").get(scrapeUserListController);

/**
 * @swagger
 * /api/v1/scrape/storage:
 *   get:
 *     summary: Get all users from the database
 *     description: Retrieves all GitHub user data stored in the database.
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Array of user objects
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *       500:
 *         description: Server error
 */
router.route("/storage").get(getUsersFromDBController);

/**
 * @swagger
 * /api/v1/scrape/storage/{username}:
 *   get:
 *     summary: Get a single user by username from the database
 *     description: Retrieves detailed data of a user identified by their GitHub username.
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: GitHub username of the user to fetch
 *     responses:
 *       200:
 *         description: User data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: User object matching the username
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.route("/storage/:username").get(getUserDetailsFromDBController);

export default router;
