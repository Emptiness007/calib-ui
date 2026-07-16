import {CalculationTypeEnum} from './calculation.type.enum';

export const INPUT_FIELDS = {
  STAGE: 'stage',
  A1: 'a1',
  A2: 'a2',
  R_NOM_IN: 'rNomIn',
  R_NOM_OUT: 'rNomOut',
} as const;

export const OUTPUT_FIELDS = {
  STAGE: 'stage',
  R_MAX_IN: 'rMaxIn',
  R_MAX_OUT: 'rMaxOut',
  K_PLATES_IN: 'kPlatesIn',
  K_PLATES_OUT: 'kPlatesOut',
  ANGLE: 'angle',
} as const;

type InputFieldKey = (typeof INPUT_FIELDS)[keyof typeof INPUT_FIELDS];
type OutputFieldKey = (typeof OUTPUT_FIELDS)[keyof typeof OUTPUT_FIELDS];

// ==================== Интерфейсы ====================
export interface StageFieldConfig {
  stages: number[];
  requiredFields: InputFieldKey[];
  displayFields: InputFieldKey[];
  outputFields: OutputFieldKey[];
  hasAngle: boolean;
  isSpecialCase?: boolean;
}

// Определяем конфигурации для нескольких ступеней разом
export const STAGE_FIELD_CONFIG: Record<CalculationTypeEnum, StageFieldConfig[]> = {
  [CalculationTypeEnum.NA]: [
    {
      stages: [4, 5, 6],
      requiredFields: [INPUT_FIELDS.R_NOM_IN, INPUT_FIELDS.R_NOM_OUT],
      displayFields: [
        INPUT_FIELDS.STAGE,
        INPUT_FIELDS.A1,
        INPUT_FIELDS.A2,
        INPUT_FIELDS.R_NOM_IN,
        INPUT_FIELDS.R_NOM_OUT
      ],
      outputFields: [
        OUTPUT_FIELDS.STAGE,
        OUTPUT_FIELDS.R_MAX_IN,
        OUTPUT_FIELDS.R_MAX_OUT,
        OUTPUT_FIELDS.K_PLATES_IN,
        OUTPUT_FIELDS.K_PLATES_OUT,
        OUTPUT_FIELDS.ANGLE
      ],
      hasAngle: true
    },
    {
      stages: [7],
      requiredFields: [INPUT_FIELDS.R_NOM_IN],
      displayFields: [
        INPUT_FIELDS.STAGE,
        INPUT_FIELDS.A1,
        INPUT_FIELDS.A2,
        INPUT_FIELDS.R_NOM_IN
      ],
      outputFields: [
        OUTPUT_FIELDS.STAGE,
        OUTPUT_FIELDS.R_MAX_IN,
        OUTPUT_FIELDS.K_PLATES_IN
      ],
      hasAngle: false,
      isSpecialCase: true
    }
  ],
  [CalculationTypeEnum.KR]: [
    {
      stages: [4, 5, 6, 7],
      requiredFields: [INPUT_FIELDS.R_NOM_IN, INPUT_FIELDS.R_NOM_OUT],
      displayFields: [
        INPUT_FIELDS.STAGE,
        INPUT_FIELDS.A1,
        INPUT_FIELDS.A2,
        INPUT_FIELDS.R_NOM_IN,
        INPUT_FIELDS.R_NOM_OUT
      ],
      outputFields: [
        OUTPUT_FIELDS.STAGE,
        OUTPUT_FIELDS.R_MAX_IN,
        OUTPUT_FIELDS.R_MAX_OUT,
        OUTPUT_FIELDS.K_PLATES_IN,
        OUTPUT_FIELDS.K_PLATES_OUT,
        OUTPUT_FIELDS.ANGLE
      ],
      hasAngle: true
    },
    {
      stages: [8],
      requiredFields: [INPUT_FIELDS.R_NOM_IN],
      displayFields: [
        INPUT_FIELDS.STAGE,
        INPUT_FIELDS.A1,
        INPUT_FIELDS.A2,
        INPUT_FIELDS.R_NOM_IN
      ],
      outputFields: [
        OUTPUT_FIELDS.STAGE,
        OUTPUT_FIELDS.R_MAX_IN,
        OUTPUT_FIELDS.K_PLATES_IN
      ],
      hasAngle: false,
      isSpecialCase: true
    }
  ]
};

export function getStageConfig(type: CalculationTypeEnum, stage: number): StageFieldConfig | undefined {
  return STAGE_FIELD_CONFIG[type]?.find(config => config.stages.includes(stage));
}

export function getRequiredFields(type: CalculationTypeEnum, stage: number): InputFieldKey[] {
  const config = getStageConfig(type, stage);
  return config?.requiredFields ?? [INPUT_FIELDS.R_NOM_IN, INPUT_FIELDS.R_NOM_OUT];
}

export function getDisplayFields(type: CalculationTypeEnum, stage: number): InputFieldKey[] {
  const config = getStageConfig(type, stage);
  return config?.displayFields ?? [
    INPUT_FIELDS.STAGE,
    INPUT_FIELDS.A1,
    INPUT_FIELDS.A2,
    INPUT_FIELDS.R_NOM_IN,
    INPUT_FIELDS.R_NOM_OUT
  ];
}

export function getOutputFields(type: CalculationTypeEnum, stage: number): OutputFieldKey[] {
  const config = getStageConfig(type, stage);
  return config?.outputFields ?? [
    OUTPUT_FIELDS.STAGE,
    OUTPUT_FIELDS.R_MAX_IN,
    OUTPUT_FIELDS.R_MAX_OUT,
    OUTPUT_FIELDS.K_PLATES_IN,
    OUTPUT_FIELDS.K_PLATES_OUT,
    OUTPUT_FIELDS.ANGLE
  ];
}

export function isSpecialCaseStage(type: CalculationTypeEnum, stage: number): boolean {
  const config = getStageConfig(type, stage);
  return config?.isSpecialCase ?? false;
}

export function getStagesByConfig(type: CalculationTypeEnum, configPredicate: (config: StageFieldConfig) => boolean): number[] {
  const configs = STAGE_FIELD_CONFIG[type]?.filter(configPredicate) ?? [];
  return configs.flatMap(config => config.stages);
}
