import { Routes } from '@angular/router';
import {Main} from './view/components/main/main';
import {AccessDenied} from './shared/auth/access-denied/access-denied';

export const routes: Routes = [
  {path:'', component: Main},
  { path: 'access-denied', pathMatch: 'full', component: AccessDenied },
  { path: '**', redirectTo: '' }
];
