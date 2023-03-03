# Documentation for `PaginationHandler` class

It's responsible for handling pagination on a web page and extracting data from each page.

The class has a constructor that takes a Page object (from Puppeteer), an IWebsiteTemplate object (which contains information about the website being scraped), and a DataHandler object.

The class has several methods:

- `getTitle()` returns the title of the current page.
- `getUrl()` returns the URL of the current page.
- `updateData()` takes new data extracted from the current page and adds it to the class's data array.
- `handle()` is the main method of the class. It updates data and clicks on the "next" or "show more" button until there is no more data to extract. It then cleans the data and saves it to MongoDB.
- `checkBlocking()` checks if the website is blocking the scraper by sending an HTTP GET request and checking the status code.
- `hasNextPage()` checks if there is a "next" or "show more" button on the current page.
- `goToNextPage()` clicks on the "next" or "show more" button.
- `hasButton()` checks if a button with the given class name exists on the page and is not disabled or hidden.
- `handleElementClick()` handles the click event on a given element.
- `getNewElementData()` extracts new data from the current page using the `parseElementsWithStreams()` method.
- `findCommonAncestor()` finds the common ancestor of a list of HTML elements.

The class also has two properties: `data` is an array of records extracted from the pages, and `prevDataLength` is the length of `data` on the previous iteration.

The class emits several events using `this.dataHandler.emit()`, including `PageStart`, `PageEnd`, `PageData`, `PageScreenShot`, `Page5Runs`, and `PageNext`. These events can be listened to by other parts of the code to perform additional actions or provide feedback to the user.
