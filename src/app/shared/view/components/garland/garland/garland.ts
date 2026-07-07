import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GARLAND_WIDTH} from '../garland.config';

@Component({
  selector: 'avi-garland',
  imports: [],
  templateUrl: './garland.html',
  styleUrl: './garland.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Garland {
//можно сделать отслеживание ширины окна браузера и перерисовывать длину гирлянды
  private readonly garlandCount = Math.round(window.innerWidth / GARLAND_WIDTH) + 1;
  garlandList = [...Array(this.garlandCount).keys()];
}
