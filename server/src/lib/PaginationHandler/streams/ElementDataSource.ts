import { ElementHandle } from 'puppeteer';
import { Readable } from 'stream';

export class ElementDataSource extends Readable {
  private elementHandles: ElementHandle<Element>[];
  private currentIndex = 0;

  constructor(elementsToProcess: ElementHandle<Element>[]) {
    super({ objectMode: true });
    this.elementHandles = elementsToProcess;
  }

  override _read() {
    if (this.currentIndex === this.elementHandles.length) {
      this.push(null);
    } else {
      this.push(this.elementHandles[this.currentIndex++]);
    }
  }
}
