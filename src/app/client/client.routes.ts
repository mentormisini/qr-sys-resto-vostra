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

] as Route[]
