import {inject, Injectable} from '@angular/core';
import {CalculationTypeEnum} from '../constant/calculation.type.enum';
import {StepInputData} from '../model/step-input-data';
import {StepResultData} from '../model/step-result-data';
import {CalculationOutput} from '../model/interface/calculation-output.interface';
import {Angle} from '../model/interface/angle.interface';
import {
  getPhysicalConstants,
  getTolerance,
  TRANSLATE_KEY
} from '../constant/calculation-constants';
import * as ExcelJS from 'exceljs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  private readonly translateService = inject(TranslateService);

  async generateReport(
    izdelieType: CalculationTypeEnum,
    inputRows: StepInputData[],
    outputRows: (StepResultData | CalculationOutput)[]
  ): Promise<Blob> {
    // Создаем рабочую книгу
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Calib-UI';
    workbook.created = new Date();

    // Добавляем одну страницу со всеми данными
    const sheet = workbook.addWorksheet('Отчет');

    // Заголовок с названием изделия
    const izdelieName = this.getIzdelieName(izdelieType);
    sheet.mergeCells('A1:F1');
    sheet.getCell('A1').value = izdelieName;
    sheet.getCell('A1').font = { bold: true, size: 16 };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    let currentRow = 3;

    currentRow = this.addInputSection(sheet, currentRow, inputRows);

    currentRow = this.addConstantsSection(sheet, currentRow, izdelieType);

    currentRow = this.addOutputSection(sheet, currentRow, outputRows);

    sheet.columns.forEach(column => {
      column.width = 15;
    });

    // Генерируем файл
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private getIzdelieName(izdelieType: CalculationTypeEnum): string {
    const translateKey = TRANSLATE_KEY[izdelieType];
    return this.translateService.instant(translateKey);
  }

  private addInputSection(
    sheet: ExcelJS.Worksheet,
    startRow: number,
    inputRows: StepInputData[]
  ): number {
    let currentRow = startRow;

    // Заголовок секции
    sheet.mergeCells(`A${currentRow}:F${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'Входные данные';
    sheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
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
    headerRow.font = { bold: true };
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
      this.applyCellBorders(sheet, currentRow, 1);
      currentRow++;
    });

    currentRow++; // Пустая строка между секциями
    return currentRow;
  }

  private addConstantsSection(
    sheet: ExcelJS.Worksheet,
    startRow: number,
    izdelieType: CalculationTypeEnum
  ): number {
    let currentRow = startRow;

    // Заголовок секции
    sheet.mergeCells(`A${currentRow}:F${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'Константы';
    sheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
    currentRow++;

    // Константы
    const tolerance = getTolerance(izdelieType);
    const hSet = getPhysicalConstants().hSet;
    const hMeasured = getPhysicalConstants().hMeasured;

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

  /**
   * Добавляет секцию выходных данных
   */
  private addOutputSection(
    sheet: ExcelJS.Worksheet,
    startRow: number,
    outputRows: (StepResultData | CalculationOutput)[]
  ): number {
    let currentRow = startRow;

    // Заголовок секции
    sheet.mergeCells(`A${currentRow}:F${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = 'Выходные данные';
    sheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
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
    headerRow.font = { bold: true };
    this.applyTableBorders(sheet, currentRow, 6);
    currentRow++;

    // Данные
    outputRows.forEach(row => {
      const dataRow = sheet.getRow(currentRow);
      const angleValue = (row as CalculationOutput).angle
        ? this.formatAngle((row as CalculationOutput).angle!)
        : '';
      dataRow.values = [
        row.stage,
        (row as CalculationOutput).rMaxIn || '',
        (row as CalculationOutput).rMaxOut || '',
        (row as CalculationOutput).kPlatesIn || '',
        (row as CalculationOutput).kPlatesOut || '',
        angleValue
      ];
      this.applyCellBorders(sheet, currentRow, 6);
      currentRow++;
    });

    return currentRow;
  }

  /**
   * Форматирует угол в строку вида "Градусы°Минуты'Секунсы""
   */
  private formatAngle(angle: Angle): string {
    if (!angle) return '';
    return `${angle.degrees}°${angle.minutes}'${angle.seconds}''`;
  }

  /**
   * Применяет границы к таблице (включая заголовки)
   */
  private applyTableBorders(sheet: ExcelJS.Worksheet, startRow: number, columns: number): void {
    const endRow = startRow + 1; // Заголовок + одна строка данных

    for (let row = startRow; row <= endRow; row++) {
      for (let col = 1; col <= columns; col++) {
        const cell = sheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }
  }

  /**
   * Применяет границы к ячейкам данных
   */
  private applyCellBorders(sheet: ExcelJS.Worksheet, row: number, columns: number): void {
    for (let col = 1; col <= columns; col++) {
      const cell = sheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }
}
