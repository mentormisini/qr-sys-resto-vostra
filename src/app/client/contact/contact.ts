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
        group([
          // Animate old items out
          query(':leave', [
            stagger(-80, [
              animate(
                '400ms ease-in-out',
                style({ opacity: 0, transform: 'rotateY(45deg) translateY(-20px) scale(0.9)' })
              )
            ])
          ], { optional: true }),

          // Animate new items in
          query(':enter', [
            style({ opacity: 0, transform: 'rotateY(-45deg) translateY(20px) scale(0.9)' }),
            stagger(120, [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'rotateY(0) translateY(0) scale(1)' })
              )
            ])
          ], { optional: true })
        ])
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

