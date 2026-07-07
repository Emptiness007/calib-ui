import {Component, inject} from '@angular/core';
import {Header} from '../../../shared/view/components/header/header/header';
import {Body} from '../body/body';
import {Footer} from '../../../shared/view/components/footer/footer/footer';
import {EventsService} from '../../../data/service/events.service';
import {APP_NAME, CURRENT_APP_VERSION} from '../../../app.constant.config';
import {TextT} from '../../../shared/translate/translate.config';

@Component({
  selector: 'app-main',
  imports: [
    Header,
    Body,
    Footer
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  private readonly eService = inject(EventsService);

  constructor() {
    this.eService.setCurrentAppVersion(CURRENT_APP_VERSION);
    this.eService.setAppName(new TextT(APP_NAME));
  }
}
