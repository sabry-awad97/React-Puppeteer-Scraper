import { ElementHandle, Page } from 'puppeteer';
import { ElementExtractor } from './ElementExtractor.js';

export class XPathExtractor extends ElementExtractor<ElementHandle> {
  private readonly _query: string;

  constructor(page: Page, query: string) {
    super(page);
    this._query = query;
  }

  extract(): Promise<ElementHandle[]> {
    return this._page.$x(this._query) as any;
  }
}
