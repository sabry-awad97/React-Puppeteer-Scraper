// Import the class under test
import { Page } from 'puppeteer';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { IWebsiteTemplate } from '../../types/index.js';
import { DataHandler } from '../DataHandler.js';
import { PaginationHandler } from './PaginationHandler.js';

describe('PaginationHandler', () => {
  let page: Page;
  let website: IWebsiteTemplate;
  let dataHandler: DataHandler;
  let paginationHandler: PaginationHandler;

  beforeEach(() => {
    page = {} as Page;
    website = {} as IWebsiteTemplate;
    dataHandler = {} as DataHandler;
    paginationHandler = new PaginationHandler(page, website, dataHandler);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTitle', () => {
    it('should mock and return the title', async () => {
      const mockPageTitle = vi.fn().mockResolvedValue('Page Title');
      page.title = mockPageTitle;
      const title = await paginationHandler.getTitle();

      expect(page.title).toBe(mockPageTitle);
      expect(title).toBe('Page Title');
      expect(page.title).toHaveBeenCalledTimes(1);
    });

    it('With whitespaces only', async () => {
      page.title = vi.fn().mockResolvedValue('   \n');
      const title = await paginationHandler.getTitle();
      expect(title).toBe('');
      expect(page.title).toHaveBeenCalledTimes(1);
    });

    it('With empty string', async () => {
      page.title = vi.fn().mockResolvedValue('');
      const title = await paginationHandler.getTitle();
      expect(title).toBe('');
      expect(page.title).toHaveBeenCalledTimes(1);
    });

    it('With undefined', async () => {
      page.title = vi.fn().mockResolvedValue(undefined);
      const title = await paginationHandler.getTitle();
      expect(title).toBe('');
      expect(page.title).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUrl', () => {
    it('should return the url of the page', async () => {
      page.url = vi.fn().mockReturnValue('https://www.example.com');
      const url = paginationHandler.getUrl();
      expect(url).toBe('https://www.example.com');
      expect(page.url).toHaveBeenCalledTimes(1);
    });
  });
});
