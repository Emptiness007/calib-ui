import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  //установка нового значения LS
  private setLS(nameLS: string, valueLS: string) {
    localStorage.setItem(encodeURI(nameLS), JSON.stringify(valueLS));
  }
  // Получение значения LS
  getLS(nameLS: string): string | null {
    const valueLS = localStorage.getItem(encodeURI(nameLS));
    if (valueLS) return JSON.parse(valueLS)
    else return null;
  }
  // Добавление значения в LS
  addPropertyLS(nameLS: string, propertyName: string, propertyValue: any) {
    const valueLS = this.getLS(nameLS);
    let valueLSParse: any = valueLS ? valueLS : {};
    valueLSParse[propertyName] = propertyValue;
    this.setLS(nameLS, valueLSParse);
  }
  // Удаление LS этого пользователя для данного ПО
  deleteLS(nameLS: string): void {
    localStorage.removeItem(encodeURI(nameLS));
  }
}
