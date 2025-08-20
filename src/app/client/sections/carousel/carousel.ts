import {Component, inject} from '@angular/core';
import {DailyDishes} from '../daily-dishes/daily-dishes';
import {Menu} from '../menu/menu';
import {animate, style, transition, trigger} from '@angular/animations';
import {AsyncPipe, NgClass} from '@angular/common';
import {AdminService} from '../../../services/admin.service';
import {take} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-carousel',
  imports: [
    DailyDishes,
    Menu,
    NgClass,
    TranslatePipe,

  ],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '800ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'translateX(0)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate(
          '800ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'translateX(-100%)', opacity: 0 })
        )
      ])
    ])
  ]

,
  standalone:true,



})
export class Carousel {
  adminService = inject(AdminService);
  slides:any;

  constructor() {
    this.adminService.getSliders().pipe(take(1)).subscribe(resp=> this.slides = resp);
  }

  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 8000); // slide every 5 seconds
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.resetAutoSlide();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.resetAutoSlide();
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
