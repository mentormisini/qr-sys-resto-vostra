import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {animate, group, query, stagger, state, style, transition, trigger} from '@angular/animations';
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
    trigger('categorySwitch', [
      transition('* => *', [
        group([
          // Animate old items out
          query(':leave', [
            stagger(-80, [
              animate(
                '400ms ease-in-out',
                style({ opacity: 0, transform: 'rotateY(45deg) translateY(-20px) scale(0.9)' })
              )
            ])
          ], { optional: true }),

          // Animate new items in
          query(':enter', [
            style({ opacity: 0, transform: 'rotateY(-45deg) translateY(20px) scale(0.9)' }),
            stagger(120, [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'rotateY(0) translateY(0) scale(1)' })
              )
            ])
          ], { optional: true })
        ])
      ])
    ])
  ]




})
export class Menu {
  adminService = inject(AdminService);
  @ViewChild('menu') menu!: ElementRef;
  categories$:any;
  selectedCategory:any;
  @ViewChild('tabsSection') tabsSection!: ElementRef;
  animationKey =0;

  ngOnInit(): void {
    this.adminService.getCategories().pipe(take(1)).subscribe(resp=> {
      this.categories$ = resp;
      this.setCategory(this.categories$[0]);
    })
  }
  showHint = false;
  private hintShown = false;





  showSwipeHint() {
    this.showHint = true;
    this.hintShown = true;

    setTimeout(() => {
      this.showHint = false;
    }, 5000);
  }

  setCategory(cat: any) {
    this.selectedCategory = cat;
    this.animationKey++;
  }
}
