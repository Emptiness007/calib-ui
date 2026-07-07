import {PageSizeEnum} from '../../view/components/table/table.config';

export enum SortDirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
  NULL = 'null'
}
export const DEFAULT_PAGE_NUMBER = 0;
export const DEFAULT_PAGE_SIZE = PageSizeEnum.VALUE_20;
export const DEFAULT_SORT_COLUMN = 'id';
export const DEFAULT_SORT_DIRECTION = SortDirectionEnum.DESC;
export const DEFAULT_SORT_DIRECTION_INNER = SortDirectionEnum.ASC;

export class SearchConfig {
  //сменить направление сортировки на следующий DESC->ASC->NULL
  static changeSortDirectionDAN(currentDirection: SortDirectionEnum): SortDirectionEnum {
    switch (currentDirection) {
      case SortDirectionEnum.ASC: return SortDirectionEnum.NULL;
      case SortDirectionEnum.DESC: return SortDirectionEnum.ASC;
      default: return SortDirectionEnum.DESC;
    }
  }
  //сменить направление сортировки на следующий ASC->DESC->NULL
  static changeSortDirectionADN(currentDirection: SortDirectionEnum): SortDirectionEnum {
    switch (currentDirection) {
      case SortDirectionEnum.ASC: return SortDirectionEnum.DESC;
      case SortDirectionEnum.DESC: return SortDirectionEnum.NULL;
      default: return SortDirectionEnum.ASC;
    }
  }
  //сортировать объекты по числовому или строковому полю
  static sortObjectsOnNumberOrStringField(objectList: any[], sortFieldName: string, sortDirection: SortDirectionEnum): any[] {
    if (objectList.length == 0) return [];//если массив пуст - сразу выдаем пустой массив
    if (!Object.keys(objectList[0]).includes(sortFieldName)) return objectList;//если заданного поля нет среди полей в объекте, выдаем массив как есть
    let sortObjectList = [];
    switch (sortDirection) {
      case SortDirectionEnum.ASC:
        sortObjectList = objectList.sort((object1, object2) => {
          return typeof object1[sortFieldName] == 'number' ?
            object1[sortFieldName] - object2[sortFieldName] :
            object1[sortFieldName].localeCompare(object2[sortFieldName]);
        });
        break;
      case SortDirectionEnum.DESC:
        sortObjectList = objectList.sort((object1, object2) => {
          return typeof object1[sortFieldName] == 'number' ?
            object2[sortFieldName] - object1[sortFieldName] :
            object2[sortFieldName].localeCompare(object1[sortFieldName]);
        });
        break;
      default:
        //если направления сортировки нет, то просто возвращаем обратно массив (или же надо отсортировать по умолчанию?)
        sortObjectList = objectList;
        break;
    }
    return sortObjectList;
  }
}
