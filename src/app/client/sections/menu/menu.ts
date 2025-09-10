import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {animate, group, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {AdminService} from '../../../services/admin.service';
import {take} from 'rxjs';
import {TitleCasePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-menu',
  imports: [
    TitleCasePipe,
    TranslatePipe
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  standalone:true,
  animations: [
    trigger('categorySwitch', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
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
