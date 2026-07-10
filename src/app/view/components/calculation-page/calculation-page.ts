import {Component, inject, input, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {StepInputData} from '../../../data/model/step-input-data';
import {StepResultData} from '../../../data/model/step-result-data';
import {CalculationTypeEnum} from '../../../data/model/calculation.type.enum';
import {CalculationService} from '../../../data/service/calculation.service';
import {getHeightA1, getHeightA2, getStages} from '../../../data/constant/calculation-constants';

const INPUT_TABLE_FIELDS: Array<keyof StepInputData> = ['stage', 'a1', 'a2', 'rNomIn', 'rNomOut'];
const OUTPUT_TABLE_FIELDS: Array<keyof StepResultData> = [
  'stage',
  'rMaxIn',
  'rMaxOut',
  'kPlatesIn',
  'kPlatesOut',
  'angle'
];

@Component({
  selector: 'app-calculation-page',
  imports: [
    TranslatePipe,
  ],
  templateUrl: './calculation-page.html',
  styleUrl: './calculation-page.scss',
})
export class CalculationPage implements OnInit{
  private readonly calculationService = inject(CalculationService);
  izdelieType = input.required<CalculationTypeEnum>();

  inputFieldList = INPUT_TABLE_FIELDS;
  outputFieldList = OUTPUT_TABLE_FIELDS;

  inputRows = signal<StepInputData[]>([]);
  outputRows = signal<StepResultData[]>([]);
  emptyMessageKey = 'SHARED.TABLE.IS-EMPTY';

  ngOnInit() {
    this.initData();
    console.log(this.izdelieType())
  }

  initData(){
    const stages = getStages(this.izdelieType());

    const rows= stages.map(stage =>{
      const a1 = getHeightA1(this.izdelieType(), stage);
      const a2 = getHeightA2(this.izdelieType(), stage);

      const row = new StepInputData(stage, a1, a2);
      row.rNomIn = '';
      row.rNomOut = '';
      return row;
    })

    this.inputRows.set(rows);
    this.outputRows.set([]);
  }

  calculateAll(){

  }

  onReset(){

  }
}
