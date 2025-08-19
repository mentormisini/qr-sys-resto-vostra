import {Component, inject} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-news',
  imports: [
    DatePipe,
    AsyncPipe
  ],
  templateUrl: './news.html',
  styleUrl: './news.scss'
})
export class News {
  adminService = inject(AdminService);
  news = this.adminService.getNews();
}
