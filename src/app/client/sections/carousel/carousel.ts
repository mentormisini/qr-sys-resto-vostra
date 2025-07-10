import { Component } from '@angular/core';
import {DailyDishes} from '../daily-dishes/daily-dishes';
import {Menu} from '../menu/menu';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-carousel',
  imports: [
    DailyDishes,
    Menu
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
  slides = [
    {
      day: 'Monday',
      dish: 'Truffle Mushroom Risotto',
      description: 'Creamy arborio rice with wild mushrooms and white truffle oil.',
      price: '€18',
      image: 'https://placehold.co/1600x700?text=Monday+Special',
    },
    {
      day: 'Tuesday',
      dish: 'Lobster Ravioli',
      description: 'Fresh pasta filled with lobster and mascarpone, saffron cream.',
      price: '€24',
      image: 'https://placehold.co/1600x700?text=Tuesday+Special',
    },
    {
      day: 'Wednesday',
      dish: 'Beef Wellington',
      description: 'Tenderloin wrapped in puff pastry, foie gras and mushroom duxelles.',
      price: '€32',
      image: 'https://placehold.co/1600x700?text=Wednesday+Special',
    },
  ];

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
    }, 5000); // slide every 5 seconds
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
