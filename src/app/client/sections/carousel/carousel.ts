import { Component } from '@angular/core';
import {DailyDishes} from '../daily-dishes/daily-dishes';
import {Menu} from '../menu/menu';
import {animate, style, transition, trigger} from '@angular/animations';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [
    DailyDishes,
    Menu,
    NgClass
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
      day: 'Text1',
      dish: 'Truffle Mushroom Risotto',
      description: 'Creamy arborio rice with wild mushrooms and white truffle oil.',
      price: '23434',
      image: 'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/colorful-bowl-of-deliciousness-with-fried-egg.png',
    },
    {
      day: 'Text 2',
      dish: 'Lobster Ravioli',
      description: 'Fresh pasta filled with lobster and mascarpone, saffron cream.',
      price: '23442',
      image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/04/perfect-grilled-steak-close-up.jpg',
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
