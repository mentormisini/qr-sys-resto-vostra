import {Component, ElementRef, ViewChild} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {take} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

import {animate, query, stagger, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-daily-dishes',
  imports: [
    TranslatePipe,


  ],
  templateUrl: './daily-dishes.html',
  styleUrl: './daily-dishes.scss',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(
              '100ms',
              animate(
                '0.6s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.6s 0.2s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],

})
export class DailyDishes {
  @ViewChild('box') box!: ElementRef;
  adminService = new AdminService();
  dishes$ :any;
  ngOnInit() {
    this.adminService.getDailyPlate().pipe(take(1)).subscribe(
      resp=> this.dishes$ = resp
    )
  }


}
