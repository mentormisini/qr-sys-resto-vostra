import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone:true
})
export class Header {
  selectedLanguage = 'English';
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.dropdownOpen = false;
    // TODO: add your language switch logic here
  }
}
