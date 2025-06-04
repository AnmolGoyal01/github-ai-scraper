import puppeteer from "puppeteer";
import logger from "./logger.js";

const setDelay = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandomUserAgent = () => {
    const USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
        "Mozilla/5.0 (X11; Linux x86_64)...",
    ];
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
};

export const scrapeGitHubUsers = async (
    keyword = "javascript developer",
    pageCount = 3
) => {
    logger.info(`Scraping GitHub users for keyword: ${keyword}`);
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    await page.setUserAgent(getRandomUserAgent());

    const users = [];
    const baseSearchUrl = `https://github.com/search?q=${encodeURIComponent(keyword)}&type=users`;

    for (let i = 1; i <= pageCount; i++) {
        const searchUrl = `${baseSearchUrl}&p=${i}`;
        logger.info(`Scraping user data from ${searchUrl}`);
        await page.goto(searchUrl, {
            waitUntil: "networkidle2",
            timeout: 10000,
        });
        await page.waitForSelector("div.ldRxiI", { timeout: 12000 });

        const pageUsers = await page.$$eval("div.ldRxiI", (cards) => {
            return cards.map((card) => {
                const usernameAnchor = card.querySelector(
                    'a[href^="/"]:not([href*="login"])'
                );
                const username =
                    usernameAnchor?.getAttribute("href")?.replace("/", "") ||
                    "";
                const name = usernameAnchor?.textContent?.trim() || "";

                const bioSpan = card.querySelector("div.dcdlju span");
                const bio = bioSpan?.innerText?.trim() || "";

                const locationLi = Array.from(card.querySelectorAll("li")).find(
                    (li) =>
                        li.textContent &&
                        !li.textContent.match(/followers|repositories/i)
                );
                const location = locationLi?.innerText?.trim() || "";

                return {
                    username,
                    name,
                    bio,
                    location,
                    profileUrl: username
                        ? `https://github.com/${username}`
                        : "",
                };
            });
        });

        for (const user of pageUsers) {
            if (!user?.profileUrl) continue;

            try {
                const profilePage = await browser.newPage();
                await profilePage.setUserAgent(getRandomUserAgent());
                logger.info(`Scraping profile data from ${user?.profileUrl}`);
                await profilePage.goto(user.profileUrl, {
                    waitUntil: "networkidle2",
                    timeout: 10000,
                });
                await setDelay(Math.random() * 101);

                // Extract pinned repos
                const pinnedRepos = await profilePage.$$eval(
                    "span.repo",
                    (repos) => repos.map((repo) => repo.textContent.trim())
                );

                // Extract contributions
                const contributions = await profilePage
                    .$eval("#js-contribution-activity-description", (el) => {
                        const match = el.textContent.trim().match(/[\d,]+/);
                        return match ? match[0].replace(/,/g, "") : "0";
                    })
                    .catch(() => "0");

                user.pinnedRepos = pinnedRepos;
                user.contributions = contributions;

                await profilePage.close();
            } catch (err) {
                logger.error(
                    `Error scraping profile ${user.profileUrl}:`,
                    err.message
                );
            }
        }

        users.push(...pageUsers);
        await setDelay(100 + Math.random() * 101);
    }

    await browser.close();
    logger.info(`Scraped ${users?.length} users`);
    return users;
};
