import {inject, Injectable} from '@angular/core';
import {FileSaverService} from 'ngx-filesaver';
import {parse} from '@tinyhttp/content-disposition';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedFileService {
  private readonly fsService = inject(FileSaverService);
  private HEADER_CD = 'content-disposition';
  private PARAMETER_FILE_NAME = 'filename';
  //открываем вкладку с инструкцией
  openInstructionPdfFile(filePath: string, tabName: string) {
    window.open(filePath, tabName);
  }
  //скачиваем файл на ПК
  downloadFile(fileName: string, data: Blob) {
    const blob = data instanceof Blob ? data : new Blob([data]);
    this.fsService.save(blob, fileName);
  }
  //скачиваем файл на ПК при получении его из ответа
  downloadFileFromResponse(response: HttpResponse<any> | null) {
    const body = response?.body;
    if (!body) return null;
    const headerData = response.headers.get(this.HEADER_CD);
    if (!headerData) return null;
    const fileName = parse(headerData).parameters[this.PARAMETER_FILE_NAME]?.toString() ?? null;
    if (!fileName) return null;
    this.downloadFile(fileName, body);
    return fileName;
  }
}
