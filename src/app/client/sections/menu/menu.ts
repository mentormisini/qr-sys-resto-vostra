import {Component, ElementRef, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  standalone:true,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ],


})
export class Menu {
  categories = ['Starters', 'Main Courses', 'Desserts', 'Drinks','Starters', 'Main Courses', 'Desserts', 'Drinks'];
  selectedCategory = 'Starters';
  @ViewChild('tabsSection') tabsSection!: ElementRef;

  showHint = false;
  private hintShown = false;
  ngAfterViewInit() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.hintShown) {
            this.showSwipeHint();
          }
        },
        { root: null, threshold: 0.5 }
      );
      observer.observe(this.tabsSection.nativeElement);
    } else {
      this.showSwipeHint();
    }
  }

  showSwipeHint() {
    this.showHint = true;
    this.hintShown = true;

    setTimeout(() => {
      this.showHint = false;
    }, 5000);
  }

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
