import {Component, inject} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {AsyncPipe} from '@angular/common';
import {refCount, shareReplay, tap} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {animate, group, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TranslatePipe,

  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  animations: [
    trigger('categorySwitch', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Contact {
  adminService = inject(AdminService);
  animationKey = 0;
  contact$ = this.adminService.getContacts().pipe(
    tap(() => this.animationKey++), // increment key on each emission
    shareReplay({ refCount: true, bufferSize: 1 }) // cache latest value
  );
}

