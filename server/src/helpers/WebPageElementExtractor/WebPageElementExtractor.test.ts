import path from 'path';
import { Browser, ElementHandle, launch, Page } from 'puppeteer';
import { fileURLToPath } from 'url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { WebPageElementExtractor } from './WebPageElementExtractor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('WebPageElementExtractor', () => {
  let browser: Browser;
  let page: Page;
  let extractor: WebPageElementExtractor;
  const fileUrl = new URL(`file://${path.join(__dirname, 'test.html')}`);

  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await page.goto(fileUrl.href);
    extractor = new WebPageElementExtractor(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('extractElementsByMultipleCriteria', () => {
    it('should return elements matching the provided CSS selector', async () => {
      // Arrange
      const options = {
        selector: '.highlighted',
      };

      // Act
      const elements = await extractor.extractElementsByMultipleCriteria(
        options
      );
      const className = await elements[0].evaluate(node => node.className);

      // Assert
      expect(elements).toBeInstanceOf(Array);

      for (const element of elements) {
        expect(element).toBeInstanceOf(ElementHandle);
      }

      expect(elements).toHaveLength(1);
      expect(className).toEqual('highlighted');
    });

    it('should return elements matching the provided tag name', async () => {
      // Arrange
      const options = { tag: 'p' };

      // Act
      const elements = await extractor.extractElementsByMultipleCriteria(
        options
      );
      const tagName = await elements[0].evaluate(node => node.tagName);
      // Assert
      expect(elements).toHaveLength(4);
      expect(tagName).toEqual('P');
    });

    it('should return elements matching the provided attribute', async () => {
      // Arrange
      const options = { attribute: 'href' };

      // Act
      const elements = await extractor.extractElementsByMultipleCriteria(
        options
      );
      const href = await elements[0].evaluate(node =>
        node.getAttribute('href')
      );
      // Assert
      expect(elements).toHaveLength(1);
      expect(href).toEqual('https://example.com');
    });

    it('should return elements matching the provided text', async () => {
      // Arrange
      const options = { text: 'Example Link' };

      // Act
      const elements = await extractor.extractElementsByMultipleCriteria(
        options
      );
      const textContent = await elements[0].evaluate(el => el.textContent);

      // Assert
      expect(elements).toHaveLength(1);
      expect(textContent).toEqual('Example Link');
    });

    it('should return elements matching the provided id', async () => {
      // Arrange
      const options = { id: 'example-link' };

      // Act
      const elements = await extractor.extractElementsByMultipleCriteria(
        options
      );
      const innerHTML = await elements[0].evaluate(el =>
        el.innerHTML.replace(/\s+/, ' ')
      );

      // Assert
      expect(elements).toHaveLength(1);
      expect(innerHTML).toEqual('Example Link');
    });

    it('should return elements matching the provided xpath', async () => {
      // Arrange
      const options = { xpath: '//*[@id="example-link"]' };

      // Act
      const elements = await extractor.extractElementsByMultipleCriteria(
        options
      );
      const innerHTML = await elements[0].evaluate(el =>
        el.innerHTML.replace(/\s+/, ' ')
      );

      // Assert
      expect(elements).toHaveLength(1);
      expect(innerHTML).toEqual('Example Link');
    });

    it('should return an empty array if no options are provided', async () => {
      // Arrange
      const options = {};

      // Act
      const elements = await extractor.extractElementsByMultipleCriteria(
        options
      );

      // Assert
      expect(elements).toEqual([]);
    });
  });

  describe('extractChildren', () => {
    it('should return an array of child elements when given a valid parent element', async () => {
      const parents = await extractor.extractElementsByMultipleCriteria({
        selector: '.content-container',
      });

      const children = await extractor.extractChildren(parents[0]);

      expect(children.length).toBeGreaterThan(0);
    });

    it('should throw an error when given an invalid parent element', async () => {
      expect(extractor.extractChildren(null as any)).rejects.toThrowError(
        'Invalid Parent Element'
      );
    });
  });

  describe('extractParent', () => {
    it('should return an array of parent elements when given a valid child element', async () => {
      const [child] = await extractor.extractElementsByMultipleCriteria({
        tag: 'a',
      });
      const parents = await extractor.extractParent(child);
      expect(parents).toHaveLength(1);
    });

    it('should throw an error when given an invalid child element', async () => {
      expect(extractor.extractParent(null as any)).rejects.toThrowError(
        'Invalid Child Element'
      );
    });
  });

  describe('extractSiblingElements', () => {
    it('should return an array of sibling elements', async () => {
      const [element] = await extractor.extractElementsByMultipleCriteria({
        id: 'header',
      });
      const siblingElements = await extractor.extractSiblingElements(element);
      expect(siblingElements).toBeInstanceOf(Array);
      expect(siblingElements.length).toBeGreaterThan(0);
      expect(siblingElements[0]).toBeInstanceOf(ElementHandle);
    });

    it('should throw an error when an invalid element is provided', async () => {
      expect(
        extractor.extractSiblingElements(null as any)
      ).rejects.toThrowError('Invalid Element');
    });
  });

  describe('extractAncestorElements', () => {
    it('should return an array of ancestor elements', async () => {
      const [element] = await extractor.extractElementsByMultipleCriteria({
        selector: '.highlighted',
      });
      const ancestorElements = await extractor.extractAncestorElements(element);
      expect(ancestorElements).toBeInstanceOf(Array);
      expect(ancestorElements.length).toBeGreaterThan(0);
      expect(ancestorElements[0]).toBeInstanceOf(ElementHandle);
    });

    it('should throw an error when an invalid element is provided', async () => {
      expect(
        extractor.extractAncestorElements(null as any)
      ).rejects.toThrowError('Invalid Element');
    });
  });

  describe('extractDescendantElements', () => {
    it('should return an array of descendant elements', async () => {
      const [element] = await extractor.extractElementsByMultipleCriteria({
        selector: '.content-container',
      });
      const ancestorElements = await extractor.extractDescendantElements(
        element
      );
      expect(ancestorElements).toBeInstanceOf(Array);
      expect(ancestorElements.length).toBeGreaterThan(0);
      expect(ancestorElements[0]).toBeInstanceOf(ElementHandle);
    });

    it('should throw an error when an invalid element is provided', async () => {
      expect(
        extractor.extractDescendantElements(null as any)
      ).rejects.toThrowError('Invalid Element');
    });
  });

  it('should return the common parent of the elements', async () => {
    const element1 = await page.$('#descendant-1');
    const element2 = await page.$('#descendant-5');

    const commonParent = await extractor.findCommonAncestor(
      element1!,
      element2!
    );
    const expectedParent = await page.$('.content-container');
    expect(commonParent).toEqual(expectedParent);
  });
});
