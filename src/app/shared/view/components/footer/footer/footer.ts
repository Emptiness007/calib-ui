import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {SharedDialogsService} from '../../../../open-dialog/shared-dialogs.service';
import {DEFAULT_AVI_LOGO_SIZE} from '../footer.config';

@Component({
  selector: 'avi-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'disable-highlight-text'}
})
export class Footer {
  private readonly sdService = inject(SharedDialogsService);

  readonly currentYear = new Date().getFullYear();
  readonly imgSize = DEFAULT_AVI_LOGO_SIZE;

  onOpenAboutDialog() {
    this.sdService.openAboutDialog();
  }
}
