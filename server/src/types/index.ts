export interface IFieldData {
  fieldName: string;
  className: string;
  type: string;
}

export interface IWebsiteTemplate {
  urls: string[];
  nextButton: string;
  showMoreButton: string;
  reviewElement: string;
  fieldData: IFieldData[];
}

export interface IRecord {
  [key: string]: null | string | string[] | Date;
}

export enum ValidCommands {
  Next = 'next',
  ScrapeAll = 'scrape_all',
  SaveMongoDB = 'save_mongodb',
  Exit = 'exit',
}

export enum PageEvents {
  PageData = 'page:data',
  PageScreenShot = 'page:screenshot',
  Page5Runs = 'page:5runs',
  PageStart = 'page:start',
  PageEnd = 'page:end',
  PageNext = 'page:next',
}

export enum ScraperEvents {
  BrowserStart = 'browser:start',
  BrowserClose = 'browser:close',
  Error = 'error',
}

export enum DataSaveEvents {
  DataSaveStart = 'dataSave:start',
  DataSaveSuccess = 'dataSave:success',
  DataSaveError = 'dataSave:error',
}
