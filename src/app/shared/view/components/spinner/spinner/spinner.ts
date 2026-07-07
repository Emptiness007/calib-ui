import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {SpinnerService} from '../spinner.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'avi-spinner',
  imports: [
    TranslatePipe
  ],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Spinner {
  private readonly sService = inject(SpinnerService);

  protected spinnerStatus = signal(false);

  constructor() {
    this.sService.isLoadingSpinner()
      .pipe( takeUntilDestroyed() )
      .subscribe(status => {
      this.spinnerStatus.set(status);
    });
  }
}
