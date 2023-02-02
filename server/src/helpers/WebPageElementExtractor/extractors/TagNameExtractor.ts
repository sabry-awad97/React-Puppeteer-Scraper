import { ElementHandle, Page } from 'puppeteer';
import { ElementExtractor } from './ElementExtractor.js';

export class TagNameExtractor extends ElementExtractor<ElementHandle> {
  private readonly _tagName: string;

  constructor(page: Page, tagName: string) {
    super(page);
    this._tagName = tagName;
  }

  extract() {
    return this._page.$$(this._tagName);
  }
}
