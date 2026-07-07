import {Injectable} from '@angular/core';
import {ThemeEnum} from './theme.config';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  changeTheme(selectedTheme: ThemeEnum){
    document.body.setAttribute('data-theme', selectedTheme);
  }
}
