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
import {Schedule} from './schedule/schedule';
import {DailyPlateDays} from './daily-plate-days/daily-plate-days';
import {Users} from './users/users';
import {Role} from '../../enum/roles.enum';
import {Translations} from './translations/translations';
@Component({
  selector: 'app-reservation-config',
  imports: [
    FormsModule,

    DatePickerModule,

    ReactiveFormsModule,
    ToasterComponent,

    AsyncPipe,
    TranslatePipe,
    NgClass,

    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Schedule,
    DailyPlateDays,
    Users,
    Translations
  ],
  templateUrl: './reservation-config.html',
  styleUrl: './reservation-config.scss'
})
export class ReservationConfig {
  bookingService = inject(BookingsService)
  user = JSON.parse(<string>localStorage.getItem('authToken')) || null;

  translate = inject(TranslateService);
  toastService = inject(ToastService);
  area$ = this.bookingService.getAreas();
  areaInput:any;

   allTablesOfArea: any;
   selectedTable:any;
  value: number = 0;
   newTableName!:string;
   newTableCapacity!:number;


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
      this.translate.instant('toast.confirm.delete_area')
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

  protected readonly Role = Role;
}
