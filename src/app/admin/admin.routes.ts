import { Route } from '@angular/router';

export default [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(c => c.Dashboard),
  },

  {
    path: 'daily-plate',
    loadComponent: () => import('./daily-plate/daily-plate').then(c => c.DailyPlate),
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu').then(c => c.Menu),
  },

] as Route[]
