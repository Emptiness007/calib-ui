export class InstructionStore {
  filePath: string;//имя файла с инструкцией
  tabName: string;//наименование вкладки в браузере с инструкцией
  constructor(filePath: string, tabName: string) {
    this.filePath = filePath;
    this.tabName = tabName;
  }
}
