import { ElementHandle } from 'puppeteer';
import { Transform, TransformCallback } from 'stream';
import { classNameToSelector } from '../../../helpers/classNameToSelector/classNameToSelector.js';
import { IFieldData, IRecord } from '../../../types/index.js';

export class ElementDataExtractor extends Transform {
  private fieldData: IFieldData[];
  private pageUrl: string;
  private pageTitle: string;

  constructor(fieldData: IFieldData[], url: string, title: string) {
    super({ objectMode: true });
    this.fieldData = fieldData;
    this.pageUrl = url;
    this.pageTitle = title;
  }

  override async _transform(
    element: ElementHandle<Element>,
    _: BufferEncoding,
    callback: TransformCallback
  ) {
    try {
      const extractedData = {
        url: this.pageUrl,
        pageTitle: this.pageTitle,
      } as IRecord;
      const extractionPromises = this.fieldData.map(async field => {
        const selector = classNameToSelector(field.className);

        if (!selector) return;

        const elements = await element.$$(selector);
        const textContent = await Promise.all(
          elements.map(el => el.evaluate(el => el.textContent?.trim() || ''))
        );

        extractedData[field.fieldName] =
          field.type.toLocaleLowerCase() === 'text'
            ? textContent.join(', ')
            : textContent;
      });
      await Promise.all(extractionPromises);
      callback(null, extractedData);
    } catch (error) {
      console.error(`Error getting data from element: ${error}`);
      callback(null, {});
    }
  }
}
