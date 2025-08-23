import { Component,Input } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-book-confirmed',
  imports: [
    FormsModule,
    NgIf,
    DatePipe
  ],
  templateUrl: './book-confirmed.html',
  styleUrl: './book-confirmed.scss'
})
export class BookConfirmed {
  response:any;
  constructor(private router: Router) {
    const nav:any = this.router.getCurrentNavigation();
    this.response = nav?.extras.state?.response;
  }
  successMessage: string | null = null;
}
