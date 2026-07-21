// ==================== Константы изделия ====================

export interface IzdelieHeightConstants {
  a1: number;
  a2: number;
}

export interface IzdeliePhysicalConstants {
  hSet: number;
  hMeasured: number;
  protocolNumber: string;
  baseOffset: number;
}

// ==================== Изделие ====================

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

export interface IzdelieSection {
  id: string;                          // уникальный идентификатор раздела (генерируется автоматически)
  nameFull: string;                    // полное название раздела
  izdelies: IzdelieConfigData[];       // список изделий в разделе
}

// ==================== Корневая структура ====================

export interface IzdelieDataConfig {
  version: string;                     // версия конфига
  lastUpdated: string;                 // дата последнего обновления
  sections: IzdelieSection[];          // список разделов
}
