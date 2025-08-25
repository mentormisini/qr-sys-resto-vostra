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
  {
    path: 'news',
    loadComponent: () => import('./admin-news/admin-news').then(c => c.AdminNews),
  },
  {
    path: 'gallery',
    loadComponent: () => import('./gallery-admin/gallery-admin').then(c => c.GalleryAdmin),
  },
  {
    path: 'slider',
    loadComponent: () => import('./admin-slider/admin-slider').then(c => c.AdminSlider),
  },
  {
    path: 'contact',
    loadComponent: () => import('./admin-contact/admin-contact').then(c => c.AdminContact),
  },
  {
    path: 'qr',
    loadComponent: () => import('./admin-qr/admin-qr').then(c => c.AdminQr),
  },
  {
    path: 'qr-reader',
    loadComponent: () => import('./qr-reader/qr-reader').then(c => c.QrReader),
  },
  {
    path: 'reservation',
    loadComponent: () => import('./reservations/reservations').then(c => c.Reservations),
  },
  {
    path: 'reservation-config',
    loadComponent: () => import('./reservation-config/reservation-config').then(c => c.ReservationConfig),
  },

] as Route[]
