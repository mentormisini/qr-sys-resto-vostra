import {Component, inject} from '@angular/core';
import { NgClass } from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {Role} from '../../../enum/roles.enum';

@Component({
  selector: 'app-admin-layout',
  imports: [
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule
  ],
  templateUrl: './admin-layout.html',
  standalone: true,
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {
  sidebarOpen = true;
  sidebarCollapsed = false;
  user = JSON.parse(<string>localStorage.getItem('authToken')) || null;
  router = inject(Router)
  // Toggle Sidebar (Open/Close)
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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
