import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-error-dialog',
  imports: [],
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDialog {

}
