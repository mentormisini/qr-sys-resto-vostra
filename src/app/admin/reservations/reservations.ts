import {Component, inject} from '@angular/core';
import {BookingsService} from '../../services/bookings.service';
import {AsyncPipe, DatePipe, NgClass} from '@angular/common';
import {UtcTimePipe} from '../../pipe/utc.pipe';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {animate, group, query, stagger, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-reservations',
  imports: [
    AsyncPipe,
    UtcTimePipe,
    FormsModule,
    DatePipe,
    TranslatePipe,
    NgClass,

  ],
  templateUrl: './reservations.html',
  standalone: true,
  styleUrl: './reservations.scss',
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
                '300ms ease-out',
                style({ opacity: 1, transform: 'rotateY(0) translateY(0) scale(1)' })
              )
            ])
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class Reservations {
bookingService = inject(BookingsService);
area$ = this.bookingService.getAreas();
tablesOfArea:any;
  selectedDate: string = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  selectedArea:any;
  animationKey=0;


  getTablesByArea(area:any){
    this.selectedArea = area;
    this.bookingService.findAllTablesByAreaID(area?.id, this.selectedDate).subscribe(resp=> {
        this.tablesOfArea = resp;
        this.animationKey++;
      }
    )
  }
  dateChanged(event:any){
    this.selectedArea = null;
    this.tablesOfArea =null;
    console.log(event)
  }
}
