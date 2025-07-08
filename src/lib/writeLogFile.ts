import { join } from "path";
import { appendFileSync } from "fs";

const startDate = new Date().toISOString().split("T")[0];
const NOT_OK_LOG = "log.jsonl";

export type LogItem = {
    date: string;
    url: string;
    statusCode: number;
    parentUrl: string | null | undefined;
    etag: string | null | undefined;
};
export function appendNotOKLog(
    fullUrl: string,
    res: Response,
    parentUrl: string | undefined,
    fileName: string
): void {
    const logItem: LogItem = {
        date: new Date().toISOString(),
        url: fullUrl,
        statusCode: res.status,
        parentUrl,
        etag: res.headers.get("etag"),
    };
    const path = join("logs", `${startDate}-${fileName}-${NOT_OK_LOG}`);
    appendFileSync(path, JSON.stringify(logItem, undefined, 4) + "\n", "utf-8");
}

const ERROR_LOG = "error.txt";
export function appendErrorLog(err: unknown, fileName: string) {
    const path = join("errors", `${startDate}-${fileName}-${ERROR_LOG}`);
    appendFileSync(
        path,
        `${new Date().toISOString()} ${(err as Error).message}\n`,
        "utf-8"
    );
}
