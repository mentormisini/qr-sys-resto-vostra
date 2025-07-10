import { Component } from '@angular/core';

@Component({
  selector: 'app-daily-dishes',
  imports: [],
  templateUrl: './daily-dishes.html',
  styleUrl: './daily-dishes.scss'
})
export class DailyDishes {
  today = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Monday"

  dishes = [
    {
      day: 'Monday',
      dish: 'Truffle Mushroom Risotto',
      description: 'Creamy arborio rice with wild mushrooms and white truffle oil.',
      price: '€18',
      image: 'https://placehold.co/600x400'
    },
    {
      day: 'Tuesday',
      dish: 'Lobster Ravioli',
      description: 'Fresh pasta filled with lobster and mascarpone, saffron cream.',
      price: '€24',
      image: 'https://placehold.co/600x400'
    },
    {
      day: 'Wednesday',
      dish: 'Beef Wellington',
      description: 'Tenderloin wrapped in puff pastry, foie gras and mushroom duxelles.',
      price: '€32',
      image: 'https://placehold.co/600x400'
    },
    {
      day: 'Thursday',
      dish: 'Duck à l’Orange',
      description: 'Crispy duck breast with caramelized orange glaze and vegetables.',
      price: '€26',
      image: 'https://placehold.co/600x400'
    },
    {
      day: 'Friday',
      dish: 'Sea Bass en Papillote',
      description: 'Oven-steamed fish with lemon butter, herbs, and seasonal vegetables.',
      price: '€22',
      image: 'https://placehold.co/600x400'
    },

  ];
}
