import { Routes } from '@angular/router';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [{
  path:'',
  loadComponent: () => import('./client/layout/layout').then(c => c.Layout),
  loadChildren: ()=> import('./client/client.routes')
},
  {
    path:'qr',
    loadComponent: ()=> import('./client/qr-section/qr-section').then(c=>c.QrSection),
  },
  {
    path:'auth',
    loadComponent: ()=> import('./admin/login/login').then(c=>c.Login),
  },
  {
    path:'auth/admin',
    canActivate:[AuthGuard],
    loadComponent: () => import('./admin/layout-admin/admin-layout/admin-layout').then(c => c.AdminLayout),
    loadChildren: ()=> import('./admin/admin.routes')
  },
  ];
