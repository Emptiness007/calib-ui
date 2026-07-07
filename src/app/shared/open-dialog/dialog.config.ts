export enum DialogModeEnum {
  ADD = 'ADD',
  COPY = 'COPY',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD'
}

export enum DialogResultEnum {
  ACCEPT,
  CONFIRM,
  CANCEL,
  EXIT
}

export enum DialogSizeEnum {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl'
}

export const DEFAULT_BACKDROP = 'static';
export const DEFAULT_KEYBOARD = true;//todo потом сменить на false
export const DEFAULT_ANIMATION = true;
export const DEFAULT_SCROLLABLE = true;
export const DEFAULT_SIZE = DialogSizeEnum.LG;
