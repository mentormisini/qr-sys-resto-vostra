import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AdminService} from '../../../services/admin.service';
import {ToastService} from '../../../shared/toast.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-daily-plate-days',
  imports: [
    FormsModule,
    TranslatePipe,
    AsyncPipe
  ],
  templateUrl: './daily-plate-days.html',
  styleUrl: './daily-plate-days.scss'
})
export class DailyPlateDays {
  adminService = inject(AdminService)
  toastService = inject(ToastService);
  translate = inject(TranslateService);
  allDays$ = this.adminService.getAllDays();
  dayName!:string;
  addDay():void{
    this.adminService.createDay({name:this.dayName}).subscribe(()=>{
      const message = this.translate.instant('toast.success.operation_successful');
      this.toastService.show(message, 'success');
      this.allDays$ = this.adminService.getAllDays();
    })
  }

  deleteDay(day:any){
    const confirmed = window.confirm(
      this.translate.instant('toast.confirm.delete_area')
    );
    if (!confirmed) return;
    this.adminService.deleteDay(day.id).subscribe(()=>{
      const message = this.translate.instant('toast.success.operation_successful');
      this.toastService.show(message, 'error');
      this.allDays$ = this.adminService.getAllDays();
    })
  }
}
