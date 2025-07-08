export async function fetchPage(url: string): Promise<Response> {
    try {
        const res = await fetch(url, {
            headers: {
                "user-agent": "EPAM/crawler",
            },
        });
        return res;
    } catch (err) {
        throw new Error(`Network error fetching ${url}`, { cause: err });
    }
}
