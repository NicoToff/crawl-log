import { exit } from "process";
import { BaseUrl } from "./lib/BaseUrl.ts";
import { processUrl } from "./lib/processUrl.ts";
import { parseAnchors } from "./lib/parseAnchors.ts";
import { logger } from "./lib/Logger.ts";
import { appendErrorLog, appendNotOKLog } from "./lib/writeLogFile.ts";

const ignoreUrlList = [
    ".google.",
    ".youtube.",
    ".facebook.",
    ".mozilla.",
    "//x.com/",
    ".microsoft.",
    ".apple.",
    "reservierung",
    "linkedin.com",
    "downloads.ctfassets.net",
    "/api/edit",
];

const visitedLinks = new Map<string, string>(); /* URL, parentURL */
const queue: string[] = [];

async function main() {
    const [, , url] = process.argv;
    if (!url) {
        logger.error("Usage: node index.js <START_URL>");
        process.exit(1);
    }
    let baseUrl: BaseUrl;
    try {
        baseUrl = new BaseUrl(url);
    } catch (error) {
        logger.error("The provided URL threw an error");
        logger.error(error);
        exit(1);
    }

    queue.push(url);

    let emptyQueueCount = 0;
    const MAX_EMPTY_CHECKS = 10;

    // Process all queued links
    setInterval(async () => {
        if (queue.length === 0) {
            emptyQueueCount++;
            logger.info(`No more links to process.`);
            if (emptyQueueCount >= MAX_EMPTY_CHECKS) {
                logger.info("Looks like we're done here ;)");
                process.exit(0);
            }
            return;
        } else {
            emptyQueueCount = 0;
        }

        const nextUrl = queue.shift();
        if (!nextUrl) return;

        try {
            logger.info(`Checking: ${nextUrl}, ${queue.length} left`);
            const fullUrl = baseUrl.getFullUrl(nextUrl);
            if (!fullUrl) {
                logger.warn(`Could not build full URL from: ${nextUrl}`);
                return;
            }

            const processed = await processUrl(fullUrl);
            if (processed.data != null) {
                const html = processed.data;
                const hrefs = parseAnchors(html, {
                    parentUrl: fullUrl,
                    getFullUrl: baseUrl.getFullUrl,
                    isExternalLink: baseUrl.isExternalLink,
                    ignoreUrlList,
                });
                for (const href of hrefs) {
                    if (!visitedLinks.has(href)) {
                        visitedLinks.set(href, nextUrl);
                        queue.push(href);
                    }
                }
            } else if (processed.error.res) {
                logger.warn(
                    `Status ${processed.error.res.status}: ${processed.error.fullUrl}`
                );
                appendNotOKLog(
                    processed.error.fullUrl,
                    processed.error.res,
                    nextUrl,
                    baseUrl.getUrlForFileName()
                );
            }
        } catch (err) {
            logger.error(`Encountered error when fetching: ${nextUrl}`);
            appendErrorLog(err, baseUrl.getUrlForFileName());
        }
    }, 750);
}

main();
