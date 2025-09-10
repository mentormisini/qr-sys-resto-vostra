import {Route} from '@angular/router';
import {CarouselStyle} from 'primeng/carousel';

export default [
  {
  path:'',
  loadComponent: ()=> import('./sections/carousel/carousel').then(c=>c.Carousel),data: { animation: 'HomePage' }
  },
  {
    path:'menu',
    loadComponent: ()=> import('./sections/menu/menu').then(c=>c.Menu),data: { animation: 'menu' }
  },
  {
    path:'news',
    loadComponent: ()=> import('./news/news').then(c=>c.News),data: { animation: 'news' }
  },
  {
    path:'contact',
    loadComponent: ()=> import('./contact/contact').then(c=>c.Contact),data: { animation: 'contact' }
  },

  {
    path:'gallery',
    loadComponent: ()=> import('./gallery/gallery').then(c=>c.Gallery),data: { animation: 'gallery' }
  },
  {
    path:'book',
    loadComponent: ()=> import('./booking/booking').then(c=>c.BookingComponent),data: { animation: 'book' }
  },
  {
    path:'book-confirmed',
    loadComponent: ()=> import('./booking/book-confirmed/book-confirmed').then(c=>c.BookConfirmed),
  },

] as Route[]
