// ==================== Константы ступени ====================

export interface HeightConstants {
  a1: number;
  a2: number;
}

// ==================== Физические константы изделия ====================

export interface PhysicalConstants {
  hSet: number;
  hMeasured: number;
  protocol: string;
  baseOffset: number;
}

// ==================== Часть изделия (part) ====================

export interface PartData {
  id: string;                          // уникальный идентификатор части
  nameDisplay: string;                 // имя для отображения в UI
  stages: Record<string, HeightConstants>; // ступени с константами (ключ - номер ступени)
  tolerance: number;                   // допуск
  physicalConstants: PhysicalConstants;
  specialStages: number[];             // специальные ступени (для них не выводится R nom out)
}

// ==================== Продукт (product) ====================

export interface ProductData {
  id: string;                          // уникальный идентификатор продукта
  nameFull: string;                    // полное название продукта
  parts: PartData[];                   // список частей изделия
}

// ==================== Корневая структура ====================

export interface ProductDataConfig {
  version: string;                     // версия конфига
  lastUpdated: string;                 // дата последнего обновления
  product: ProductData[];              // список продуктов
}
