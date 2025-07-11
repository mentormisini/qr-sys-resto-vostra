import {Route} from '@angular/router';

export default [
  {
  path:'',
  loadComponent: ()=> import('./sections/carousel/carousel').then(c=>c.Carousel),
  },

] as Route[]
