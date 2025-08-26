import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {TitleCasePipe} from '@angular/common';
import {BookingsService} from '../../../services/bookings.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../../shared/toast.service';

@Component({
  selector: 'app-schedule',
  imports: [
    ReactiveFormsModule,
    DatePicker,
    TitleCasePipe,
    TranslatePipe
  ],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule implements OnInit {
  bookingService = inject(BookingsService)
  scheduleForm!: FormGroup;
  fb =inject(FormBuilder)
  translate = inject(TranslateService);
  toastService = inject(ToastService);
  schedule: any;
  ngOnInit() {
    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([])  // FormArray to hold multiple rows
    });

    this.bookingService.getSchedule().subscribe((res: any) => {
      this.schedule = res;
      this.loadSchedule(res)
    });
  }
  get schedules(): FormArray {
    return this.scheduleForm.get('schedules') as FormArray;
  }

  loadSchedule(data: any[]) {
    data.forEach(item => {
      // convert "08:00:00" to Date object
      const start = this.parseTime(item.openTime);
      const end = this.parseTime(item.closeTime);

      this.schedules.push(this.fb.group({
        id: [item.id],
        dayOfWeek: [item.dayOfWeek, Validators.required],
        openTime: [start, Validators.required],
        closeTime: [end, Validators.required]
      }));
    });
  }

// helper function to parse "HH:mm:ss" into a Date object
  parseTime(timeStr: string): Date {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }
  save(index: number) {
    const schedule = this.schedules.at(index).value;

    const startTimeStr = this.formatTime(schedule.openTime);
    const endTimeStr = this.formatTime(schedule.closeTime);
    const payload ={      ...schedule,
      openTime: startTimeStr,
      closeTime: endTimeStr}

    this.bookingService.editSchedule(payload, schedule?.id).subscribe(()=>{
      const message = this.translate.instant('toast.success.operation_successful');
      this.toastService.show(message, 'success');
    })
  }

  formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}
