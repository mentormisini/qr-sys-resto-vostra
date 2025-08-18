import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AdminService} from '../../../services/admin.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [


  ],
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
  adminService = inject(AdminService);
  categories$:any;
  selectedCategory:any;
  @ViewChild('tabsSection') tabsSection!: ElementRef;

  ngOnInit(): void {
    this.adminService.getCategories().pipe(take(1)).subscribe(resp=> {
      this.categories$ = resp;
      this.setCategory(this.categories$[0]);
    })
  }
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

  setCategory(cat: any) {
    this.selectedCategory = cat;
  }
}
