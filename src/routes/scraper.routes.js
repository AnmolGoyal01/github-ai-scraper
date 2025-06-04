import { Router } from "express";
import {
    scrapeUserListController,
    getUsersFromDBController,
    getUserDetailsFromDBController,
} from "../controllers/scraper.controllers.js";

const router = Router();

router.route("/").get(scrapeUserListController);
router.route("/storage").get(getUsersFromDBController);
router.route("/storage/:username").get(getUserDetailsFromDBController);

export default router;
