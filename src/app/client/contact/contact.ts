import {Component, inject} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {AsyncPipe} from '@angular/common';
import {refCount, shareReplay} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TranslatePipe,

  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  adminService = inject(AdminService);
  contact$ = this.adminService.getContacts().pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );
}

