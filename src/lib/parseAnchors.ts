import { JSDOM } from "jsdom";

export function parseAnchors(
    html: string,
    {
        parentUrl,
        getFullUrl,
        isExternalLink,
        ignoreUrlList,
    }: {
        parentUrl: string;
        getFullUrl: (path: string) => string | undefined;
        isExternalLink: (url: string) => boolean;
        ignoreUrlList?: string[];
    }
): string[] {
    const { window } = new JSDOM(html, {
        pretendToBeVisual: true,
        storageQuota: 10 * 1024, // 10 KB
    });
    const document = window.document;

    // Select all <a> elements with an href attribute
    const anchorEls = document.querySelectorAll<HTMLAnchorElement>("a[href]");
    const hrefs: string[] = [];
    for (const element of anchorEls) {
        const href = element.getAttribute("href")?.trim();

        if (!href) continue; // skip if empty href

        const fullUrl = getFullUrl(href);
        if (!fullUrl) {
            console.debug(`Could not build full URL from: ${href}`);
            continue;
        }

        const isIgnored = ignoreUrlList?.some((subStr) =>
            fullUrl.includes(subStr)
        );
        if (isIgnored) {
            console.debug(`⏭️ Is on ignore list: ${fullUrl}`);
            continue;
        }

        // Do check a link to other websites, but don't continue crawling on them
        const isParentExternal = isExternalLink(parentUrl);
        if (isParentExternal) {
            console.debug(`⏭️ Parent URL is external ${parentUrl}`);
            continue;
        }

        hrefs.push(href);
    }
    return hrefs;
}
