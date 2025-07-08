# Crawl Log

A simple CLI tool to crawl a website and log details about its links.

## How it Works

This tool starts crawling from a given URL and systematically navigates through the website's internal links. Here's a breakdown of its functionality:

-   **Starting Point**: The initial URL you provide is the starting point for the crawl.
-   **Crawling Scope**: The crawler will only visit pages that belong to the same domain as the starting URL.
-   **External Links**: It identifies and checks the status of external links but does not crawl their content.
-   **Logging**: The primary purpose is to find broken links. It creates logs for any page that returns a non-OK (i.e., not a 2xx status code) HTTP response. Error logs are also created for any issues encountered during the crawl.

## Getting Started

### Prerequisites

-   Node.js (v24.0.0 or higher is recommended, v23@latest should also work)

### Installation

- Clone the repo
- Install dependencies:
```bash
corepack enable
pnpm install
```

## Usage

To start the crawler, run the following command, replacing `<your-website-url>` with the URL you want to crawl:

```bash
pnpm start <your-website-url>
```
## Output

-   **Status Logs**: Information about pages with non-OK status codes is saved in the `logs/` directory.
-   **Error Logs**: Any processing errors are logged in the `errors/` directory.
