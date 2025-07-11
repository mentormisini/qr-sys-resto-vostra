import { Routes } from '@angular/router';

export const routes: Routes = [{
  path:'',
  loadComponent: () => import('./client/layout/layout').then(c => c.Layout),
  loadChildren: ()=> import('./client/client.routes')
},
  {
    path:'qr',
    loadComponent: ()=> import('./client/qr-section/qr-section').then(c=>c.QrSection),
  }
  ];
