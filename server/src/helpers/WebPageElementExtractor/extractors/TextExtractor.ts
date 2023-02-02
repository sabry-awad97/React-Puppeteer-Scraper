import { ElementHandle, Page } from 'puppeteer';
import { ElementExtractor } from './ElementExtractor.js';
import { XPathExtractor } from './XPathExtractor.js';

export class TextExtractor extends ElementExtractor<ElementHandle> {
  private readonly _text: string;

  constructor(page: Page, text: string) {
    super(page);
    this._text = text;
  }

  extract() {
    return new XPathExtractor(
      this._page,
      `//*[contains(text(), '${this._text}')]`
    ).extract();
  }
}
