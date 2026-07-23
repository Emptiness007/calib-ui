# Calib-UI
веб-приложение для калибров
**Calib-UI** — очного инструмента, разработанное на Angular 22 с использованием встроенного Express.js бэкенда.

## 📋 Содержание

- [Технологии](#технологии)
- [Требования](#требования)
- [Установка](#установка)
- [Запуск проекта](#запуск-проекта)
- [Структура проекта](#структура-проекта)
- [API](#api)
- [Данные](#данные)
- [Основные функции](#основные-функции)

## 🛠 Технологии

### Frontend
- **Angular 22** — основной фреймворк
- **TypeScript** — язык разработки
- **Bootstrap 5** — UI фреймворк
- **ExcelJS** — генерация отчетов в Excel
- **ngx-translate** — локализация

### Backend
- **Node.js 24.14.0** — среда выполнения
- **Express.js 5** — веб-фреймворк
- **UUID** — генерация уникальных идентификаторов
- **CORS** — поддержка кросс-доменных запросов

## 📦 Требования

- **Node.js**: 24.14.0 (рекомендуется использовать nvm)
- **npm**: последняя стабильная версия
- **Браузер**: современный браузер с поддержкой ES2022

## 🚀 Установка

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd calib-ui
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте версию Node.js** (если используется nvm)
```bash
nvm use 24.14.0
```

## ▶️ Запуск проекта

### Режим разработки

Запуск Angular dev сервера (порт 4200) и Express.js бэкенда (порт 3000) одновременно:

```bash
npm run dev
```

### Покомпонентный запуск

**Angular сервер:**
```bash
npm run start
```
Откроется на `https://localhost:4200`

**Express.js бэкенд:**
```bash
npm run server
```
Запустится на `http://localhost:3000`

### Сборка проекта

```bash
# Основная сборка
npm run build

# Сборка с авторизацией
npm run build-auth

# Сборка для тестового окружения
npm run build-test

# Сборка для тестов с авторизацией
npm run build-test-auth
```

## 📁 Структура проекта

```
calib-ui/
├── server/                    # Backend (Express.js)
│   ├── index.js              # Точка входа сервера
│   ├── config/
│   │   └── izdelie-data.json # Конфигурация изделий
│   └── routes/
│       └── product-routes.js # API маршруты
├── src/
│   ├── app/
│   │   ├── data/
│   │   │   ├── constant/     # Константы
│   │   │   ├── model/        # Модели данных
│   │   │   │   ├── interface/ # Интерфейсы
│   │   │   │   └── izdelie-data.interface.ts
│   │   │   └── service/      # Сервисы
│   │   │       ├── calculation.service.ts
│   │   │       ├── excel-export.service.ts
│   │   │       ├── events.service.ts
│   │   │       └── izdelie-config.service.ts
│   │   ├── shared/           # Общие компоненты и сервисы
│   │   │   ├── auth/         # Аутентификация
│   │   │   ├── view/         # Общие UI компоненты
│   │   │   └── service/      # Общие сервисы
│   │   └── view/             # Компоненты представления
│   │       └── components/
│   │           ├── body/
│   │           └── calculation-page/
│   └── environments/
│       └── environment.ts    # Конфигурация окружения
├── public/
│   └── i18n/                 # Файлы локализации
│       └── ru.json
└── package.json
```

## 🔌 API

### Endpoints для работы с изделиями

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/config/izdelie` | Получить всю конфигурацию |
| GET | `/api/config/izdelie/sections` | Получить все разделы |
| GET | `/api/config/izdelie/sections/:id` | Получить раздел по ID |
| GET | `/api/config/izdelie/sections/:id/izdelies` | Получить изделия из раздела |
| GET | `/api/config/izdelie/izdelie/:id` | Получить изделие по ID |
| POST | `/api/config/izdelie/sections` | Добавить новый раздел |
| POST | `/api/config/izdelie/sections/:sectionId/izdelies` | Добавить изделие в раздел |
| PUT | `/api/config/izdelie/sections/:id` | Обновить раздел |
| PUT | `/api/config/izdelie/sections/:sectionId/izdelies/:id` | Обновить изделие |
| DELETE | `/api/config/izdelie/sections/:id` | Удалить раздел |
| DELETE | `/api/config/izdelie/sections/:sectionId/izdelies/:id` | Удалить изделие |

### Примеры запросов

**Получить все разделы:**
```bash
curl http://localhost:3000/api/config/izdelie/sections
```

**Добавить новый раздел:**
```bash
curl -X POST http://localhost:3000/api/config/izdelie/sections \
  -H "Content-Type: application/json" \
  -d '{
    "nameShort": "Калибры",
    "nameFull": "Калибровочный инструмент",
    "izdelies": []
  }'
```

## 📊 Данные

### Структура конфигурации (`izdelie-data.json`)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-01",
  "sections": [{
    "id": "sec_a1b2c3d4",
    "nameShort": "Калибры",
    "nameFull": "Калибровочный инструмент",
    "izdelies": [{
      "id": "item_x9y8z7w6",
      "nameDisplay": "Калибр NA",
      "stages": [4, 5, 6, 7],
      "heightConstants": {
        "4": { "a1": 183, "a2": 196 }
      },
      "tolerance": 0.08,
      "physicalConstants": {
        "hSet": 263,
        "hMeasured": 262.9737,
        "protocolNumber": "1857",
        "baseOffset": 233
      },
      "specialStages": [7]
    }]
  }]
}
```

### Генерация ID
- **Разделы**: `sec_${8chars}` (например, `sec_a1b2c3d4`)
- **Изделия**: `item_${8chars}` (например, `item_x9y8z7w6`)

## 🎯 Основные функции

### Расчет калибровки
- Поддержка нескольких ступеней расчета
- Специальные ступени (только R nom. вход)
- Автоматический расчет Rmax, K плиток, угла

### Экспорт в Excel
- Генерация отчетов в формате `.xlsx`
- Включение входных и выходных данных
- Константы изделия (допуск, H заданное, H измеренное, номер протокола)

### Локализация
- Поддержка русского языка
- Расширяемая система переводов

### Управление изделиями
- Загрузка конфигурации из JSON
- Динамическое добавление разделов и изделий
- Автоматическая генерация ID

## 🔧 Скрипты package.json

| Скрипт | Описание |
|--------|----------|
| `npm run start` | Запуск Angular dev сервера |
| `npm run server` | Запуск Express.js бэкенда |
| `npm run dev` | Запуск обоих серверов |
| `npm run build` | Сборка проекта |
| `npm run test` | Запуск тестов |
| `npm run t-update` | Обновление файлов локализации |


## 🐛 Решение проблем

### CORS ошибки
Убедитесь, что Express.js сервер запущен и настроен на обработку запросов с `https://localhost:4200`.

### Ошибки подключения к API
Проверьте, что бэкенд сервер запущен на порту 3000:
```bash
npm run server
```

### Ошибки зависимостей
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 Лицензия

© 2026 Calib-UI. Все права защищены.
