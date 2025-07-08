import { fetchPage } from "./fetchPage.ts";

export async function processUrl(fullUrl: string) {
    if (!fullUrl) {
        return {
            data: null,
            error: {
                fullUrl: undefined,
                res: undefined,
            },
        };
    }

    const res = await fetchPage(fullUrl);

    if (!res.ok) {
        if (res.status === 304 || res.status === 308) {
            console.log(
                "res.status",
                res.status,
                "res.redirected",
                res.redirected
            );
        }
        return {
            data: null,
            error: {
                fullUrl,
                res,
            },
        };
    }

    return {
        data: await res.text(),
        error: null,
    };
}
