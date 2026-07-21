// ==================== Константы изделия ====================

export interface IzdelieHeightConstants {
  a1: number;
  a2: number;
}

export interface IzdeliePhysicalConstants {
  hSet: number;                          // Н заданное (263 мм)
  hMeasured: number;                     // Н измеренное (262.9737 мм)
  protocolNumber: string;                // Номер протокола (например, "1857")
  baseOffset: number;
}

// ==================== Изделие ====================

/**
 * Конфигурация изделия
 *
 * Структура сохраняется текущая:
 * - stages: массив номеров ступеней
 * - heightConstants: константы высот по ступеням
 * - tolerance: допуск
 * - physicalConstants: физические константы
 * - specialStages: массив номеров специальных ступеней
 *   (для специальных ступеней не выводится ввод R nom out)
 */
export interface IzdelieConfigData {
  id: string;                          // уникальный идентификатор изделия (генерируется автоматически)
  nameDisplay: string;                 // имя для отображения в UI (не из переводов)
  stages: number[];                    // список ступеней
  heightConstants: Record<string, IzdelieHeightConstants>;
  tolerance: number;                   // допуск
  physicalConstants: IzdeliePhysicalConstants;
  specialStages: number[];             // специальные ступени (для них не выводится R nom out)
}

// ==================== Раздел (Категория) ====================

/**
 * Конфигурация раздела (категории)
 */
export interface IzdelieSection {
  id: string;                          // уникальный идентификатор раздела (генерируется автоматически)
  nameShort: string;                   // краткое название раздела
  nameFull: string;                    // полное название раздела
  izdelies: IzdelieConfigData[];       // список изделий в разделе
}

// ==================== Корневая структура ====================

/**
 * Корневая структура конфигурации изделий
 */
export interface IzdelieDataConfig {
  version: string;                     // версия конфига
  lastUpdated: string;                 // дата последнего обновления
  sections: IzdelieSection[];          // список разделов
}
