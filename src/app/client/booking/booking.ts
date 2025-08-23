import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, DatePipe, JsonPipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {BookingsService} from '../../services/bookings.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BookConfirmed} from './book-confirmed/book-confirmed';
import {Router} from '@angular/router';

@Component({
  selector: 'app-booking',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    AsyncPipe,

    SlicePipe,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px) scale(0.95)'
      })),
      transition(':enter', [
        animate('0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)', style({
          opacity: 1,
          transform: 'translateY(0) scale(1)'
        }))
      ]),
      transition(':leave', [
        animate('0.4s ease-in', style({
          opacity: 0,
          transform: 'translateY(-20px) scale(0.95)'
        }))
      ])
    ])
  ]

})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookingService = inject(BookingsService);
  area$ = this.bookingService.getAreas();
  bookingDate: string = '';
  tableAvailable: any;
  availableSlots: any;
  weekDates: any[] = [];
  selectedArea: any;
  selectedTable: any;
  durations = [30, 60, 90, 120];
  selectedDuration: number = 30;
  router = inject(Router)


  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      tableId: ['', Validators.required],
      customerName: ['', Validators.required],
      phone: ['', Validators.required],
      guests: [''],
      startTime: ['', Validators.required],
      endTime: ['']
    });
  }

  ngOnInit() {
    this.generateCurrentWeek();
  }

  generateCurrentWeek() {
    const today = new Date();
    this.weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      this.weekDates.push({
        date,
        dayNumber: date.getDate(),
        dayShort: date.toLocaleDateString('en-US', {weekday: 'short'}),
        dateString: date.toISOString().split('T')[0],
        isDisabled: isWeekend
      });
    }
  }

  selectDate(day: any) {
    if (day.isDisabled) return;
    this.bookingDate = day.dateString;
    this.bookingForm.patchValue({startTime: '', endTime: '', tableId: ''});
    this.tableAvailable = null;
    this.availableSlots = null;
    this.selectedArea = null;
    this.selectedTable = null;
  }

  getTablesOfArea(area: any) {
    this.selectedArea = area;
    this.bookingService.getAvailableTablesOfArea(area.id, this.bookingDate)
      .subscribe(resp => this.tableAvailable = resp);
  }

  selectDuration(duration: number) {
    this.selectedDuration = duration;
    if (this.selectedTable) {
      this.getSlotsOfTable(this.selectedTable);
    }
  }

  getSlotsOfTable(table: any) {
    this.selectedTable = table;
    this.bookingForm.patchValue({tableId: table.id, guests: table.capacity});

    this.bookingService.getFreeSlotsOfTable(table.id, this.bookingDate, this.selectedDuration)
      .subscribe(resp => this.availableSlots = resp);
  }

  selectTime(slot: any) {
    this.bookingForm.patchValue({startTime: slot.start, endTime: slot.end});
  }

  submitBooking() {
    if (this.bookingForm.invalid) return;


    this.bookingService.book(this.bookingForm.value).subscribe((response)=>{
      this.bookingForm.reset();
      this.bookingDate = '';
      this.tableAvailable = null;
      this.availableSlots = null;
      this.selectedArea = null;
      this.selectedTable = null;
      this.selectedDuration = 30;
      // Navigate and pass full object
      this.router.navigate(['book-confirmed'], {
        state: { response: response }
      });


    })


  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return hours === 1 ? '1h' : `${hours} h`;
    }
    return `${hours}h:${mins} min`;
  }

}
