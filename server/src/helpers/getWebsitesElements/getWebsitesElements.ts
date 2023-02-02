import config from '../../config.json' assert { type: 'json' };
import type { IWebsiteTemplate } from '../../types';

export function getWebsitesElements() {
  const templates: IWebsiteTemplate[] = [];
  for (const website of config.websites) {
    templates.push({
      urls: website.urls,
      nextButton: website.nextButton,
      showMoreButton: website.showMoreButton,
      reviewElement: website.reviewElement,
      fieldData: website.fieldData,
    });
  }

  return templates;
}
