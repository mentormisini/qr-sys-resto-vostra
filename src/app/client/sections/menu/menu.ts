import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  categories = ['Starters', 'Main Courses', 'Desserts', 'Drinks'];
  selectedCategory = 'Starters';

  menuItems = [
    {
      category: 'Starters',
      name: 'Burrata & Heirloom Tomatoes',
      description: 'Creamy burrata with basil oil and cherry tomatoes.',
      price: '€10'
    },
    {
      category: 'Starters',
      name: 'Foie Gras Toast',
      description: 'Duck liver on brioche toast with fig jam.',
      price: '€14'
    },
    {
      category: 'Main Courses',
      name: 'Filet Mignon',
      description: 'Grilled tenderloin with truffle mashed potatoes.',
      price: '€32'
    },
    {
      category: 'Main Courses',
      name: 'Black Cod Miso',
      description: 'Marinated cod with ginger soy glaze and bok choy.',
      price: '€29'
    },
    {
      category: 'Desserts',
      name: 'Chocolate Fondant',
      description: 'Warm molten chocolate cake with vanilla ice cream.',
      price: '€11'
    },
    {
      category: 'Desserts',
      name: 'Crème Brûlée',
      description: 'Classic vanilla custard with caramelized sugar top.',
      price: '€9'
    },
    {
      category: 'Drinks',
      name: 'Sparkling Water',
      description: 'San Pellegrino 750ml',
      price: '€4'
    },
    {
      category: 'Drinks',
      name: 'Red Wine (Merlot)',
      description: 'Glass of fine Merlot red wine.',
      price: '€6'
    }
  ];

  get filteredMenu() {
    return this.menuItems.filter(item => item.category === this.selectedCategory);
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
  }
}
