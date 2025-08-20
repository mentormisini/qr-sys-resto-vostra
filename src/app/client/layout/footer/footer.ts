import {Component, inject} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {shareReplay} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    AsyncPipe,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone:true
})
export class Footer {
  currentYear: number = new Date().getFullYear();
  adminService = inject(AdminService);
  contact$ = this.adminService.getContacts().pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );
}
