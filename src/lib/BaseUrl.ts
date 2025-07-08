export class BaseUrl {
    baseUrl: string;

    constructor(url: string) {
        this.baseUrl = new URL(url).origin;
    }

    getUrlForFileName = () =>
        new URL(this.baseUrl).origin
            .replace("https://", "")
            .replace(/[\.\/]/g, "_");

    getFullUrl = (path: string): string | undefined => {
        if (BaseUrl.isRelativePath(path)) {
            return `${this.baseUrl}${path}`;
        }
        if (path.startsWith("http")) {
            return path;
        }
        return undefined;
    };

    isExternalLink = (url: string): boolean => {
        return (
            url.startsWith("http") &&
            !BaseUrl.areSameHostname(url, this.baseUrl)
        );
    };

    static isRelativePath = (path: string) => path.startsWith("/");
    static getHostname = (url: string) => {
        return new URL(url).hostname.replace("www.", "");
    };
    static areSameHostname = (url1: string, url2: string) => {
        return BaseUrl.getHostname(url1) === BaseUrl.getHostname(url2);
    };
}
