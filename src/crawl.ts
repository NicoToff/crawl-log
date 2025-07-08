import { join } from "path";
import { appendFileSync } from "fs";
import { BaseUrl } from "./lib/BaseUrl.ts";
import { processUrl } from "./lib/processUrl.ts";
import { parseAnchors } from "./lib/parseAnchors.ts";
import { logger } from "./lib/Logger.ts";

const startDate = new Date().toISOString().split("T")[0];

const NOT_FOUND_LOG = "log.jsonl";
const ERROR_LOG = "error.txt";

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

export type LogItem = {
    date: string;
    url: string;
    statusCode: number;
    parentUrl: string | null | undefined;
    etag: string | null | undefined;
};
export function logNotOK(fullUrl: string, res: Response, domain: string): void {
    const logItem: LogItem = {
        date: new Date().toISOString(),
        url: fullUrl,
        statusCode: res.status,
        parentUrl: visitedLinks.get(fullUrl),
        etag: res.headers.get("etag"),
    };
    const path = join("logs", `${startDate}-${domain}-${NOT_FOUND_LOG}`);
    appendFileSync(path, JSON.stringify(logItem, undefined, 4) + "\n", "utf-8");
}

async function main() {
    const [, , url] = process.argv;
    if (!url) {
        logger.error("Usage: node index.js <START_URL>");
        process.exit(1);
    }
    const baseUrl = new BaseUrl(url);

    queue.push(url);

    // Process all queued links
    setInterval(async () => {
        if (queue.length === 0) {
            logger.info("No more links to process.");
            return;
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
                logNotOK(
                    processed.error.fullUrl,
                    processed.error.res,
                    baseUrl.getDomain()
                );
            }
        } catch (err) {
            logger.error(`Encountered error when fetching: ${nextUrl}`);
            const path = join(
                "errors",
                `${startDate}-${baseUrl.getDomain()}-${ERROR_LOG}`
            );
            appendFileSync(
                path,
                `${new Date().toISOString()} ${(err as Error).message}\n`,
                "utf-8"
            );
        }
    }, 750);
}

main();
