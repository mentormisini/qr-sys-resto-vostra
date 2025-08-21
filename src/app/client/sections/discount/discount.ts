import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-discount',
  imports: [
    TranslatePipe
  ],
  templateUrl: './discount.html',
  styleUrl: './discount.scss'
})
export class Discount {
  router = inject(Router)
  navigateToRestaurant() {
    // Navigate to restaurant page or section
    this.router.navigate(['/qr']);
  }
}
