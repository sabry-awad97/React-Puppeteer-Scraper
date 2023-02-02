import { ElementHandle, Page } from 'puppeteer';
import { ElementExtractor } from './ElementExtractor.js';

export class AttributeExtractor extends ElementExtractor<ElementHandle> {
  private readonly _attributeName: string;

  constructor(page: Page, attribute: string) {
    super(page);
    this._attributeName = attribute;
  }

  extract() {
    return this._page.$$(`[${this._attributeName}]`);
  }
}
