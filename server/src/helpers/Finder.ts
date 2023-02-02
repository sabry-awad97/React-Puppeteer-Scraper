import { Page } from 'puppeteer';

export class Finder {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async findAll(
    selector: string,
    type: string = 'selector',
    options: any = {}
  ): Promise<any[]> {
    let elements: any[];
    switch (type) {
      case 'attribute':
        elements = await this.page.evaluate((selector: string) => {
          return Array.from(document.querySelectorAll(`[${selector}]`));
        }, selector);
        break;
      case 'xpath':
        elements = await this.page.evaluate((selector: string) => {
          const elements = new Array<HTMLElement>();
          const xpathResult = document.evaluate(
            selector,
            document,
            null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE,
            null
          );
          let element = xpathResult.iterateNext();
          while (element) {
            elements.push(element as any);
            element = xpathResult.iterateNext();
          }
          return elements;
        }, selector);
        break;
      case 'regex':
        elements = await this.page.evaluate((selector: string) => {
          const elements = new Array<HTMLElement>();
          const regex = new RegExp(selector);
          const allElements = document.querySelectorAll('*');
          for (const element of allElements) {
            if (regex.test(element.innerHTML)) {
              elements.push(element as any);
            }
          }
          return elements;
        }, selector);
        break;
      case 'selector':
      default:
        elements = await this.page.evaluate((selector: string) => {
          return Array.from(document.querySelectorAll(selector));
        }, selector);
        break;
    }

    // Additional functionality
    if (options.attributes) {
      elements = elements.map((el: any) => el.getAttribute(options.attributes));
    }
    if (options.filter) {
      elements = elements.filter(options.filter);
    }
    if (options.map) {
      elements = elements.map(options.map);
    }
    if (options.limit) {
      elements = elements.slice(0, options.limit);
    }
    return elements;
  }
}
