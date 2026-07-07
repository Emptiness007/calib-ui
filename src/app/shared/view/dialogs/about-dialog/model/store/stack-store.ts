export class StackStore {
  constructor(library: string, version: string, translateKey: string) {
    this.library = library;
    this.version = version;
    this.translateKey = translateKey;
  }
  library: string;
  version: string;
  translateKey: string;
}
