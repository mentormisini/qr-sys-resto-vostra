import { Component } from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {AsyncPipe} from '@angular/common';
import {take} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-daily-dishes',
  imports: [
    TranslatePipe

  ],
  templateUrl: './daily-dishes.html',
  styleUrl: './daily-dishes.scss'
})
export class DailyDishes {

  adminService = new AdminService();
  dishes$ :any;
  ngOnInit() {
    this.adminService.getDailyPlate().pipe(take(1)).subscribe(
      resp=> this.dishes$ = resp
    )
  }

}
