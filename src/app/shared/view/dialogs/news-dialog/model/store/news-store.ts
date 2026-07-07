export class NewsStore {
  constructor(version: string, date: Date | number, descriptionList: string[]) {
    this.version = version;
    this.date = date instanceof Date ? date : new Date(date);
    this.descriptionList = descriptionList;
  }

  version: string;
  date: Date;
  descriptionList: string[];

  formatDate(language: string): string {
    return this.date.toLocaleDateString(language, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
