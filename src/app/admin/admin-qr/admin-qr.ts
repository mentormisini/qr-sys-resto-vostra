import {Component, inject} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {AsyncPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-admin-qr',
  imports: [
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './admin-qr.html',
  styleUrl: './admin-qr.scss'
})
export class AdminQr {
adminService = inject(AdminService);
allQR = this.adminService.getAllQr();
}
