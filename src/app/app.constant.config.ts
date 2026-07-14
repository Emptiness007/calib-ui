export const CURRENT_APP_VERSION = 'v.0.0.0';

export const DELAY_TIME = 300;
export const APP_NAME = 'APP.NAME'
export const LS_APP_NAME = 'calib';
export const LS_APP_NAME_TEST = 'calibtest';
export const LS_APP_TAB = 'tab';
export const LS_STEP_DATA = 'sid';
export const LS_RESULT_DATA = 'srd';

export const INPUT_TABLE_FIELDS = {
  STAGE: 'stage',
  A1: 'a1',
  A2: 'a2',
  R_NOM_IN: 'rNomIn',
  R_NOM_OUT: 'rNomOut',
} as const;

export const OUTPUT_TABLE_FIELDS = {
  STAGE: 'stage',
  R_MAX_IN: 'rMaxIn',
  R_MAX_OUT: 'rMaxOut',
  K_PLATES_IN: 'kPlatesIn',
  K_PLATES_OUT: 'kPlatesOut',
  ANGLE: 'angle',
} as const;

type InputFieldKey = (typeof INPUT_TABLE_FIELDS)[keyof typeof INPUT_TABLE_FIELDS];
type OutputFieldKey = (typeof OUTPUT_TABLE_FIELDS)[keyof typeof OUTPUT_TABLE_FIELDS];

export const INPUT_FIELD_LIST: InputFieldKey[] = Object.values(INPUT_TABLE_FIELDS);
export const OUTPUT_FIELD_LIST: OutputFieldKey[] = Object.values(OUTPUT_TABLE_FIELDS);
