import pc from "picocolors";

class Logger {
    constructor() {
        this.#intro();
    }

    #intro(): void {
        const logo = [
            "",
            "",
            "    ██████╗██████╗  █████╗ ██╗    ██╗██╗         ██╗      ██████╗  ██████╗ ",
            "   ██╔════╝██╔══██╗██╔══██╗██║    ██║██║         ██║     ██╔═══██╗██╔════╝ ",
            "   ██║     ██████╔╝███████║██║ █╗ ██║██║         ██║     ██║   ██║██║  ███╗",
            "   ██║     ██╔══██╗██╔══██║██║███╗██║██║         ██║     ██║   ██║██║   ██║",
            "   ╚██████╗██║  ██║██║  ██║╚███╔███╔╝███████╗    ███████╗╚██████╔╝╚██████╔╝",
            "    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝    ╚══════╝ ╚═════╝  ╚═════╝ ",
            "",
        ];

        logo.forEach((line) => console.log(pc.cyan(line)));
        console.log("\n");
    }

    #getTimestamp(): string {
        return pc.gray(new Date().toLocaleTimeString());
    }

    info(message?: any, ...optionalParams: any[]): void {
        console.log(
            `${this.#getTimestamp()} ${pc.blue("INFO")}`,
            message,
            ...optionalParams
        );
    }

    warn(message?: any, ...optionalParams: any[]): void {
        console.warn(
            `${this.#getTimestamp()} ${pc.yellow("WARN")}`,
            message,
            ...optionalParams
        );
    }

    error(message?: any, ...optionalParams: any[]): void {
        console.error(
            `${this.#getTimestamp()} ${pc.red("ERROR")}`,
            message,
            ...optionalParams
        );
    }

    debug(message?: any, ...optionalParams: any[]): void {
        if (process.env.IS_DEBUG === "true") {
            console.debug(
                `${this.#getTimestamp()} ${pc.magenta("DEBUG")}`,
                message,
                ...optionalParams
            );
        }
    }
}

export const logger = new Logger();
