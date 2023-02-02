import { ElementHandle, JSHandle, Page } from 'puppeteer';
import { AttributeExtractor } from './extractors/AttributeExtractor.js';
import { CSSSelectorExtractor } from './extractors/CSSSelectorExtractor.js';
import { ElementExtractor } from './extractors/ElementExtractor.js';
import { IDExtractor } from './extractors/IDExtractor.js';
import { TagNameExtractor } from './extractors/TagNameExtractor.js';
import { TextExtractor } from './extractors/TextExtractor.js';
import { XPathExtractor } from './extractors/XPathExtractor.js';

interface ExtractOptions {
  selector?: string;
  id?: string;
  tag?: string;
  attribute?: string;
  text?: string;
  xpath?: string;
  debug?: boolean;
}

export class WebPageElementExtractor {
  private readonly _page: Page;

  constructor(page: Page) {
    this._page = page;
  }

  async extractElementsByMultipleCriteria(
    options: ExtractOptions
  ): Promise<ElementHandle<Element>[]> {
    const extractors: ElementExtractor<ElementHandle>[] = [];

    if (options.selector) {
      extractors.push(new CSSSelectorExtractor(this._page, options.selector));
    }

    if (options.id) {
      extractors.push(new IDExtractor(this._page, options.id));
    }

    if (options.tag) {
      extractors.push(new TagNameExtractor(this._page, options.tag));
    }

    if (options.attribute) {
      extractors.push(new AttributeExtractor(this._page, options.attribute));
    }

    if (options.xpath) {
      extractors.push(new XPathExtractor(this._page, options.xpath));
    }

    if (options.text) {
      extractors.push(new TextExtractor(this._page, options.text));
    }

    if (!extractors.length) {
      console.warn(
        `[${new Date().toISOString()}] No extractors found for page ${this._page.url()}`
      );
      return [];
    }

    try {
      const pageElements = await Promise.all(
        extractors.map(extractor => extractor.extract())
      );
      const extractedElements = pageElements.flat();

      if (options.debug) {
        console.log(
          `[${new Date().toISOString()}] Extracted Elements for page ${this._page.url()}:`,
          pageElements
        );
      }

      return extractedElements;
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error occurred while extracting elements from page ${this._page.url()}: ${error}`
      );
      return [];
    }
  }

  public async extractChildren(
    parent: ElementHandle
  ): Promise<ElementHandle[]> {
    if (!parent || !parent.remoteObject) {
      throw new Error('Invalid Parent Element');
    }
    return parent.$$('*');
  }

  public async extractParent(child: ElementHandle): Promise<ElementHandle[]> {
    if (!child || !child.remoteObject) {
      throw new Error('Invalid Child Element');
    }
    // return child.$$('xpath/..');
    return child.$$('xpath/parent::*');
  }

  public async extractSiblingElements(
    element: ElementHandle
  ): Promise<ElementHandle[]> {
    if (!element || !element.remoteObject) {
      throw new Error('Invalid Element');
    }

    return element.$$(
      'xpath/following-sibling::* | xpath/preceding-sibling::*'
    );
  }

  public async extractFollowingElements(
    element: ElementHandle
  ): Promise<ElementHandle[]> {
    if (!element || !element.remoteObject) {
      throw new Error('Invalid Element');
    }

    return element.$$(
      'xpath/following-sibling::* | xpath/preceding-sibling::*'
    );
  }

  public async extractPrecidingElements(
    element: ElementHandle
  ): Promise<ElementHandle[]> {
    if (!element || !element.remoteObject) {
      throw new Error('Invalid Element');
    }

    return element.$$('xpath/preceding-sibling::*');
  }

  public async extractAncestorElements(
    element: ElementHandle
  ): Promise<ElementHandle[]> {
    if (!element || !element.remoteObject) {
      throw new Error('Invalid Element');
    }

    return element.$$('xpath/ancestor::*');
  }

  public async extractDescendantElements(
    element: ElementHandle
  ): Promise<ElementHandle[]> {
    if (!element || !element.remoteObject) {
      throw new Error('Invalid Element');
    }

    return element.$$('xpath/descendant::*');
  }

  public async extractNextElement(
    element: ElementHandle
  ): Promise<ElementHandle | null> {
    if (!element || !element.remoteObject) {
      throw new Error('Invalid Element');
    }

    const nextElement = await element.$$('xpath/following-sibling::*[1]');
    return nextElement.length ? nextElement[0] : null;
  }

  public async extractPreviousElement(
    element: ElementHandle
  ): Promise<ElementHandle | null> {
    if (!element || !element.remoteObject) {
      throw new Error('Invalid Element');
    }

    const previousElement = await element.$$('xpath/preceding-sibling::*[1]');
    return previousElement.length ? previousElement[0] : null;
  }

  async findCommonAncestor(
    ...elementHandles: ElementHandle[]
  ): Promise<ElementHandle | null> {
    const result = await this._page.evaluateHandle((...handles) => {
      let ancestors = new Set<Node | null>();
      let currentNode: Node | null = handles[0];
      let found = false;
      while (currentNode) {
        ancestors.add(currentNode);
        currentNode = currentNode.parentNode;
      }
      let commonAncestor: Node | null = null;
      for (let i = 1; i < handles.length; i++) {
        currentNode = handles[i];
        while (currentNode) {
          if (ancestors.has(currentNode)) {
            if (!found) {
              found = true;
              commonAncestor = currentNode;
            } else {
              ancestors.clear();
              ancestors.add(commonAncestor);
              currentNode = commonAncestor;
            }
          }
          currentNode = currentNode ? currentNode.parentNode : null;
        }
      }
      return commonAncestor;
    }, ...elementHandles);

    return result.asElement() as ElementHandle<Element>;
  }
}
