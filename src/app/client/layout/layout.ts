import { Component } from '@angular/core';
import {Header} from './header/header';
import {RouterOutlet} from '@angular/router';
import {Footer} from './footer/footer';
import {animate, group, query, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-layout',
  imports: [
    Header,
    RouterOutlet,
    Footer
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone:true,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        // Position both enter & leave absolutely so they overlap
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),

        // Initial state of the new page
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px) scale(0.98)' })
        ], { optional: true }),

        // Animate both at once
        group([
          // Fade + slide out old page
          query(':leave', [
            animate('400ms ease', style({ opacity: 0, transform: 'translateY(-20px) scale(1.02)' }))
          ], { optional: true }),

          // Fade + slide in new page
          query(':enter', [
            animate('400ms 100ms ease', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]


})
export class Layout {
  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
