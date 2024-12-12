import { Routes } from '@angular/router';
import { DetailsComponent } from './core/details/details.component';
import { HomeComponent } from './core/home/home.component';
const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'home',
    component: DetailsComponent,
    title: 'Home details',
  },
];

export default routeConfig;
