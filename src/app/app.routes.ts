import { Routes } from '@angular/router';

export const routes: Routes = [{
  path:'',
  loadComponent: () => import('./client/layout/layout').then(c => c.Layout),
  loadChildren: ()=> import('./client/client.routes')
}];
