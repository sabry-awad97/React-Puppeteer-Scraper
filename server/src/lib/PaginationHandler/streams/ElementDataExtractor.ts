import { ElementHandle } from 'puppeteer';
import { Transform, TransformCallback } from 'stream';
import { classNameToSelector } from '../../../helpers/classNameToSelector/classNameToSelector.js';
import { IFieldData, IRecord } from '../../../types/index.js';

class FindError extends Error {
  constructor(public override readonly message: string) {
    super(message);
  }
}

export class Field {
  constructor(
    public readonly selector: string,
    public readonly name: string,
    public readonly type: string
  ) {}

  public async extractValue(parent: ElementHandle<Element>) {
    const childs = await parent.$$(this.selector);
    if (!childs.length) {
      throw new FindError(
        `Cannot find element with selector "${this.selector}"`
      );
    }

    const textContent = await Promise.all(
      childs.map(child => child.evaluate(el => el.textContent?.trim() || ''))
    );

    return this.type.toLocaleLowerCase() === 'text'
      ? textContent.join(', ')
      : textContent;
  }
}

export class ElementDataExtractor extends Transform {
  private fields: Field[];
  private pageUrl: string;
  private pageTitle: string;

  constructor(fieldData: IFieldData[], url: string, title: string) {
    super({ objectMode: true });
    this.fields = fieldData.map(
      ({ className, fieldName, type }) =>
        new Field(classNameToSelector(className) as string, fieldName, type)
    );
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

      const extractionPromises = this.fields.map(async field => {
        const value = await field.extractValue(element);
        extractedData[field.name] = value;
      });

      await Promise.all(extractionPromises);
      callback(null, extractedData);
    } catch (error) {
      console.error(`Error getting data from element: ${error}`);
      callback(null, {});
    }
  }
}
