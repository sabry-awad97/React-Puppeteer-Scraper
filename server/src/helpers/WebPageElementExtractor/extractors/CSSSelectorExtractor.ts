import { ElementHandle, Page } from 'puppeteer';
import { ElementExtractor } from './ElementExtractor.js';

export class CSSSelectorExtractor extends ElementExtractor<ElementHandle> {
  private readonly _selector: string;

  constructor(page: Page, selector: string) {
    super(page);
    this._selector = selector;
  }

  extract() {
    return this._page.$$(this._selector);
  }
}
