import {Route} from '@angular/router';

export default [
  {
  path:'',
  loadComponent: ()=> import('./sections/carousel/carousel').then(c=>c.Carousel),
  },
  {
    path:'menu',
    loadComponent: ()=> import('./sections/menu/menu').then(c=>c.Menu),
  },
  {
    path:'news',
    loadComponent: ()=> import('./news/news').then(c=>c.News),
  },
  {
    path:'contact',
    loadComponent: ()=> import('./contact/contact').then(c=>c.Contact),
  },

  {
    path:'gallery',
    loadComponent: ()=> import('./gallery/gallery').then(c=>c.Gallery),
  },

] as Route[]
