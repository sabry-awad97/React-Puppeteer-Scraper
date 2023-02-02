import { ElementHandle, Page } from 'puppeteer';
import { ElementExtractor } from './ElementExtractor.js';

export class IDExtractor extends ElementExtractor<ElementHandle> {
  private readonly _id: string;

  constructor(page: Page, id: string) {
    super(page);
    this._id = id;
  }

  extract() {
    return this._page.$$(`#${this._id}`);
  }
}
