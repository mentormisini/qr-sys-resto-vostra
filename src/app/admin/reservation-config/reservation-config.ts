import {Component, inject} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import {AsyncPipe, JsonPipe, NgClass, NgForOf, TitleCasePipe, UpperCasePipe} from '@angular/common';
import {BookingsService} from '../../services/bookings.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../shared/toast.service';
import {ToasterComponent} from '../../shared/notify/notify';
import {switchMap, tap} from 'rxjs';
import {Button} from 'primeng/button';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
@Component({
  selector: 'app-reservation-config',
  imports: [
    FormsModule,

    DatePickerModule,

    ReactiveFormsModule,
    ToasterComponent,
    TitleCasePipe,
    AsyncPipe,
    TranslatePipe,
    NgClass,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
  ],
  templateUrl: './reservation-config.html',
  styleUrl: './reservation-config.scss'
})
export class ReservationConfig {
  bookingService = inject(BookingsService)
  scheduleForm!: FormGroup;
  fb =inject(FormBuilder)
  translate = inject(TranslateService);
  toastService = inject(ToastService);
  area$ = this.bookingService.getAreas();
  areaInput:any;
  schedule: any;
   allTablesOfArea: any;
   selectedTable:any;
  value: number = 0;
   newTableName!:string;
   newTableCapacity!:number;
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

  createArea(){
    this.bookingService.createArea({name: this.areaInput}).subscribe(()=>{
      this.area$ = this.bookingService.getAreas();
      const message = this.translate.instant('toast.success.operation_successful');
      this.toastService.show(message, 'success');
    })
  }
  editArea(area:any){
    this.bookingService.editArea(area,area?.id).subscribe(()=>{
      this.area$ = this.bookingService.getAreas();
      const message = this.translate.instant('toast.info.some_info');
      this.toastService.show(message, 'info');
    })

  }
  editTable(table:any){

    const payload ={
      name: table?.name,
      capacity: table?.capacity,
    }
    this.bookingService.editTable(payload,table?.id).subscribe(()=>{
      this.area$ = this.bookingService.getAreas();
      const message = this.translate.instant('toast.info.some_info');
      this.toastService.show(message, 'info');
    })

  }
  deleteArea(area: any) {
    const confirmed = window.confirm(
      this.translate.instant('toast.confirm.delete_area') // e.g. "Are you sure you want to delete this area?"
    );

    if (confirmed) {
      this.bookingService.deleteArea(area?.id).subscribe(() => {
        this.area$ = this.bookingService.getAreas();
        const message = this.translate.instant('toast.success.operation_successful');
        this.toastService.show(message, 'success');
      });
    }
  }

  deleteTable(area: any) {
    const confirmed = window.confirm(
      this.translate.instant('toast.confirm.delete_area') // e.g. "Are you sure you want to delete this area?"
    );

    if (confirmed) {
      this.bookingService.deleteTable(area?.id).subscribe(() => {
          this.showTablesOfArea(this.selectedTable);
        const message = this.translate.instant('toast.success.operation_successful');
        this.toastService.show(message, 'success');
      });
    }
  }


  showTablesOfArea(area:any){
    this.selectedTable = area;
    this.bookingService.getTablesByArea(area?.id).subscribe(resp=>{
      this.allTablesOfArea = resp;
    })
  }

  addTableOnArea() {
    const payload = {
      name: this.newTableName,
      capacity: this.newTableCapacity,
      areaId: this.selectedTable?.id
    };

    this.bookingService.createTableOnArea(payload).pipe(
      tap(() => {
        const message = this.translate.instant('toast.success.operation_successful');
        this.toastService.show(message, 'success');
        this.newTableName ='';
        this.newTableCapacity = 1;
      }),
      switchMap(() => this.bookingService.getTablesByArea(this.selectedTable?.id))
    ).subscribe(resp => {
      this.allTablesOfArea = resp;

    });
  }

}
