export interface IRecord {
  [key: string]: string | string[];
}

export type IRecordWithKey = IRecord & { key: number };

export interface IField {
  fieldName: string;
  className: string;
  type: string;
}

export interface IWebsiteTemplate {
  urls: string[];
  nextButton: string;
  showMoreButton: string;
  reviewElement: string;
  fieldData: IField[];
}

export type TFilteredKeys = '__v' | '_id' | 'key' | 'pageTitle' | 'url';

export type TCurrentViewRecord = Omit<IRecordWithKey, TFilteredKeys>;

export interface IMessage {
  text: string;
  isBot: boolean;
  timestamp: string;
}
