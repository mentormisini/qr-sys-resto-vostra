import {Component, inject} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Role} from '../../../enum/roles.enum';
import {ReservationSocketService} from '../../../services/socket.service';
import { Howl } from 'howler';
import {ToasterComponent} from '../../../shared/notify/notify';
import {ToastService} from '../../../shared/toast.service';
@Component({
  selector: 'app-admin-layout',
  imports: [
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    ToasterComponent,
    DatePipe
  ],
  templateUrl: './admin-layout.html',
  standalone: true,
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {
  reservationService = inject(ReservationSocketService);
  sidebarOpen = true;
  sidebarCollapsed = false;
  user = JSON.parse(<string>localStorage.getItem('authToken')) || null;
  router = inject(Router)
  audio!: Howl;
  translate = inject(TranslateService)
  toastService = inject(ToastService);
  newReservation: any = null;
  constructor() {
    this.audio = new Howl({
      src: ['notify.mp3'],
      loop: true, // Loops the audio continuously
      volume: 1.0, // Set volume to 100%
    });
    this.reservationService.connect();
    this.reservationService.onReservationCreated().subscribe((data) => {

      this.newReservation = data;
      this.audio.play();
      console.log('New reservation received:', data);
    });
  }
  viewReservation(reservation: any) {

    this.router.navigate(['/auth/admin/reservation']);
    this.audio.stop();
  }
  // Toggle Sidebar (Open/Close)
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeNotification(){
    this.audio.stop();
    this.newReservation = null;
  }

  // Toggle Sidebar Collapse (Full/Collapsed)
  toggleSidebarCollapse() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Close Sidebar when clicking a menu item
  closeSidebar() {
    this.sidebarOpen = false;
  }

  logOut(){
    localStorage.removeItem('authToken'); // Store token in localStorage
    this.router.navigate(['auth']);
  }

  protected readonly Role = Role;
}
