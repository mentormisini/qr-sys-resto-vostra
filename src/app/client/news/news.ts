import {Component, inject} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass} from '@angular/common';
import {AdminService} from '../../services/admin.service';
import {TranslatePipe} from '@ngx-translate/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-news',
  imports: [
    DatePipe,
    AsyncPipe,
    TranslatePipe,

  ],
  templateUrl: './news.html',
  styleUrl: './news.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '4.5rem', // approx 3 lines
        opacity: 0.8,
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      transition('collapsed => expanded', [
        animate('1000ms cubic-bezier(0.25, 1, 0.5, 1)') // smooth ease-out
      ]),
      transition('expanded => collapsed', [
        animate('1000ms cubic-bezier(0.75, 0, 0.5, 1)') // snappy ease-in
      ])
    ])
  ]
})
export class News {
  adminService = inject(AdminService);
  news = this.adminService.getNews();
animationKey = 0;

  toggleExpand(item: any) {
    item.expanded = !item.expanded;
    this.animationKey++;
  }
}
