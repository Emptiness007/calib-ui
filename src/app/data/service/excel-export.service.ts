import {inject, Injectable} from '@angular/core';
import {StepInputData} from '../model/step-input-data';
import {StepResultData} from '../model/step-result-data';
import {IzdelieConfigData} from '../model/izdelie-data.interface';
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {Angle} from '../model/interface/angle.interface';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  async generateReport(
    izdelie: IzdelieConfigData,
    inputRows: StepInputData[],
    outputRows: StepResultData[]
  ): Promise<void> {
    // Создаем рабочую книгу
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Calib-UI';
    workbook.created = new Date();

    // Добавляем одну страницу со всеми данными
    const sheet = workbook.addWorksheet('Отчет');

    // Заголовок с названием изделия
    sheet.mergeCells('A1:G1');
    sheet.getCell('A1').value = izdelie.nameDisplay;
    sheet.getCell('A1').font = {bold: true, size: 16};
    sheet.getCell('A1').alignment = {horizontal: 'center'};

    let currentRow = 3;

    currentRow = this.addInputSection(sheet, currentRow, inputRows, izdelie);

    currentRow = this.addConstantsSection(sheet, currentRow, izdelie);

    currentRow = this.addOutputSection(sheet, currentRow, outputRows);

    sheet.columns.forEach(column => {
      column.width = 18;
    });

    // Генерируем и сохраняем файл
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const fileName = `Отчет_${izdelie.nameDisplay}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
  }

  private addInputSection(
    sheet: ExcelJS.Worksheet,
    startRow: number,
    inputRows: StepInputData[],
    izdelie: IzdelieConfigData
  ): number {
    let currentRow = startRow;

    // Заголовок секции
    sheet.mergeCells(`A${currentRow}:G${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'Входные данные';
    sheet.getCell(`A${currentRow}`).font = {bold: true, size: 14};
    currentRow++;

    // Заголовки колонок
    const headerRow = sheet.getRow(currentRow);
    headerRow.values = [
      'Ступень',
      'A1',
      'A2',
      'R ном. вход',
      'R ном. выход'
    ];
    headerRow.font = {bold: true};
    this.applyTableBorders(sheet, currentRow, 5);
    currentRow++;

    // Данные
    inputRows.forEach(row => {
      const dataRow = sheet.getRow(currentRow);
      dataRow.values = [
        row.stage,
        row.a1,
        row.a2,
        row.rNomIn || '',
        row.rNomOut || ''
      ];
      this.applyCellBorders(sheet, currentRow, 5);
      currentRow++;
    });

    currentRow++; // Пустая строка между секциями
    return currentRow;
  }

  private addConstantsSection(
    sheet: ExcelJS.Worksheet,
    startRow: number,
    izdelie: IzdelieConfigData
  ): number {
    let currentRow = startRow;

    // Заголовок секции
    sheet.mergeCells(`A${currentRow}:G${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'Константы изделия';
    sheet.getCell(`A${currentRow}`).font = {bold: true, size: 14};
    currentRow++;

    // Константы
    const {tolerance, physicalConstants} = izdelie;
    const {hSet, hMeasured} = physicalConstants;

    const constantsData = [
      ['Допуск X:', tolerance],
      ['H заданное:', hSet],
      ['H измеренное:', hMeasured]
    ];

    constantsData.forEach(([label, value]) => {
      sheet.mergeCells(`A${currentRow}:B${currentRow}`);
      sheet.getCell(`A${currentRow}`).value = `${label} ${value}`;
      this.applyCellBorders(sheet, currentRow, 2);
      currentRow++;
    });

    currentRow++; // Пустая строка между секциями
    return currentRow;
  }

  private addOutputSection(
    sheet: ExcelJS.Worksheet,
    startRow: number,
    outputRows: StepResultData[]
  ): number {
    let currentRow = startRow;

    // Заголовок секции
    sheet.mergeCells(`A${currentRow}:G${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'Выходные данные';
    sheet.getCell(`A${currentRow}`).font = {bold: true, size: 14};
    currentRow++;

    // Заголовки колонок
    const headerRow = sheet.getRow(currentRow);
    headerRow.values = [
      'Ступень',
      'Rmax вх',
      'Rmax вых',
      'K плиток вх',
      'K плиток вых',
      'Угол'
    ];
    headerRow.font = {bold: true};
    this.applyTableBorders(sheet, currentRow, 6);
    currentRow++;

    // Данные
    outputRows.forEach(row => {
      const dataRow = sheet.getRow(currentRow);
      const angleValue = row.angle ? this.formatAngle(row.angle) : '';
      dataRow.values = [
        row.stage,
        row.rMaxIn || '',
        row.rMaxOut || '',
        row.kPlatesIn || '',
        row.kPlatesOut || '',
        angleValue
      ];
      this.applyCellBorders(sheet, currentRow, 6);
      currentRow++;
    });

    return currentRow;
  }

  private formatAngle(angle: Angle): string {
    if (!angle) return '';
    return `${angle.degrees}°${angle.minutes}'${angle.seconds}''`;
  }

  private applyTableBorders(sheet: ExcelJS.Worksheet, startRow: number, columns: number): void {
    const endRow = startRow + 1;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = 1; col <= columns; col++) {
        const cell = sheet.getCell(row, col);
        cell.border = {
          top: {style: 'thin'},
          left: {style: 'thin'},
          bottom: {style: 'thin'},
          right: {style: 'thin'}
        };
      }
    }
  }

  private applyCellBorders(sheet: ExcelJS.Worksheet, row: number, columns: number): void {
    for (let col = 1; col <= columns; col++) {
      const cell = sheet.getCell(row, col);
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    }
  }
}
