import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe
  ]
})
export class AccessDenied {
  private readonly authService = inject(AuthService);

  openPlatformPage(){
    this.authService.openPlatformPage();
  }
}
