import { Routes } from '@angular/router';
import { SwipeComponent } from './swipe/swipe.component';
import { LikersComponent } from './likers/likers.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: SwipeComponent,
  },
  {
    path: 'liked',
    component: LikersComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
