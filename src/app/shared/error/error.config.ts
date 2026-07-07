export class CustomError {
  constructor(status: number, url: string, title: string, messageErrorList: string[]) {
    this.status = status;
    this.url = url;
    this.title = title;
    this.messageErrorList = messageErrorList;
  }
  readonly status: number;
  readonly url: string;
  readonly title: string;
  messageErrorList: string[] = [];
}
