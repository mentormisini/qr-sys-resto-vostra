import {Component, inject, ViewChild} from '@angular/core';
import {BookingsService} from '../../services/bookings.service';
import {AsyncPipe, DatePipe, NgClass, UpperCasePipe} from '@angular/common';
import {UtcTimePipe} from '../../pipe/utc.pipe';
import {FormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {animate, group, query, stagger, style, transition, trigger} from '@angular/animations';
import {ZXingScannerComponent, ZXingScannerModule} from '@zxing/ngx-scanner';
import { DatePickerModule } from 'primeng/datepicker';
import {ToastService} from '../../shared/toast.service';
import {ToasterComponent} from '../../shared/notify/notify';

@Component({
  selector: 'app-reservations',
  imports: [
    AsyncPipe,
    UtcTimePipe,
    FormsModule,
    DatePipe,
    TranslatePipe,
    NgClass,
    ZXingScannerModule,
    DatePickerModule,
    ToasterComponent,
    UpperCasePipe

  ],
  templateUrl: './reservations.html',
  standalone: true,
  styleUrl: './reservations.scss',
  animations: [
    trigger('categorySwitch', [
      transition('* => *', [
        group([
          // Old items exit: super quick
          query(':leave', [
            stagger(-20, [
              animate(
                '120ms ease-in',
                style({
                  opacity: 0,
                  transform: 'translateY(-40px) scale(0.7)'
                })
              )
            ])
          ], { optional: true }),

          // New items enter: almost all together, slight stagger for energy
          query(':enter', [
            style({
              opacity: 0,
              transform: 'translateY(-40px) scale(1.1)'
            }),
            stagger(40, [ // tighter stagger
              animate(
                '180ms cubic-bezier(0.25, 1.25, 0.5, 1)', // quick bounce ease
                style({
                  opacity: 1,
                  transform: 'translateY(0) scale(1)'
                })
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
  translate = inject(TranslateService);
  toastService = inject(ToastService);
  selectedDate: Date = new Date();

  selectedArea:any;
  animationKey=0;
  clickToShowFooter!:any;
  @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

  qrResult: string | null = null;
  serverMessage: string | null = null;
  successMessage: any;
  scanned = false;
  currentDevice: MediaDeviceInfo | undefined;
  showScanModal =false;

  getTablesByArea(area: any) {
    this.selectedArea = area;

    // Format as yyyy-MM-dd safely in local Europe time
    const date = this.selectedDate;
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const formatted = `${year}-${month}-${day}`;



    this.bookingService.findAllTablesByAreaID(area?.id, formatted).subscribe(resp => {
      this.tablesOfArea = resp;
      this.animationKey++;
    });
  }

  dateChanged(event:any){
    this.selectedArea = null;
    this.tablesOfArea =null;

  }
  assignFooter(code:string){
    this.clickToShowFooter = code;

  }

  onCodeResult(result: string) {
    if (this.scanned) return;
    this.scanned = true;

    this.qrResult = result;
    this.serverMessage = null;
    this.successMessage = null;

    this.bookingService.getReservationByQR(this.qrResult).subscribe({
      next: (res: any) => {
        this.successMessage = res[0];

        if (!res || res.length === 0) {
          this.serverMessage = 'qr-not-found';
        }
          this.stopCamera();
      },
      error: (err) => {
        this.successMessage = false;
        this.serverMessage = "Server error. Please try again.";


        this.stopCamera();
      }
    });
  }

  stopCamera() {
    if (this.scanner && this.scanner.scanStop) {
      this.scanner.scanStop(); // built-in stop method from ngx-scanner
    }
  }

  startCamera() {
    this.scanned = false;
    this.qrResult = null;
    this.serverMessage = null;
    this.successMessage = null;

    if (this.scanner && this.scanner.scanStart) {
      this.scanner.scanStart();
    }
  }
  deleteReservation(reservation: any) {
    const confirmDelete = window.confirm(
      this.translate.instant('toast.confirm.delete_area')
    );

    if (confirmDelete) {
      this.bookingService.deleteReservation(reservation.id).subscribe({
        next: () => {
          const message = this.translate.instant('toast.success.operation_successful');
          this.toastService.show(message, 'error');
          this.getTablesByArea(this.selectedArea)
        },
        error: (err) => {
          const message = this.translate.instant('toast.error.operation_failed');
          this.toastService.show(message, 'error');

        }
      });
    }
  }

}
