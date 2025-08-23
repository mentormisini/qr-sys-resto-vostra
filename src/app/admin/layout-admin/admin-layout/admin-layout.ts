import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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


}
