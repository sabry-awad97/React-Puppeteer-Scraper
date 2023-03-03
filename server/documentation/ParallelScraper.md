# Documentation fron `ParallelScraper` class

Properties:

- `concurrency`: a number that represents the maximum number of concurrent requests that can be made at the same time.
- `dataHandler`: an instance of the `DataHandler` class that is used to handle data saving and cleaning operations.

Methods:

- `start()`: a method that launches a headless browser using Puppeteer.
- `close()`: a method that closes the browser.
- `scrapeWebsite(website: IWebsiteTemplate)`: a method that starts the scraping process for a given website. It iterates through all the URLs defined in the website and adds a new task to the task queue for each URL.
- `scrapeUrl(url: string, website: IWebsiteTemplate)`: a method that navigates to a given URL and starts the pagination process by creating a new instance of the `PaginationHandler` class.

The `ParallelScraper` class makes use of the `TaskQueue` and `DataHandler` classes to manage concurrency and handle data operations, respectively. It also uses the `PaginationHandler` class to handle pagination on the website being scraped. The class emits several events using the `DataHandler` instance, such as `BrowserStart`, `BrowserClose`, `Error`, and various events related to scraping and data saving.
