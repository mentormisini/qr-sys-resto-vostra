import {Component, ElementRef, HostListener, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ToastService} from '../../../shared/toast.service';
import {ToasterComponent} from '../../../shared/notify/notify';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    TranslatePipe,
    ToasterComponent,
    UpperCasePipe
  ],
  animations: [
    trigger('overlayAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', [animate('300ms ease-in')]),
      transition(':leave', [animate('300ms ease-out')])
    ]),
    trigger('menuAnimation', [
      state('void', style({ transform: 'translateX(100%)' })),
      state('*', style({ transform: 'translateX(0%)' })),
      transition(':enter', [animate('300ms ease-out')]),
      transition(':leave', [animate('300ms ease-in')])
    ])
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone:true
})
export class Header {
  selectedLanguage ='';
  dropdownOpen = false;
  mobileMenuOpen:any;
  language = localStorage.getItem('language');
  translate = inject(TranslateService);
  toastService = inject(ToastService);
  eRef = inject(ElementRef);
constructor() {
  if(this.language){
    this.translate.use(this.language)
    this.selectedLanguage = this.language
  }else{
    this.translate.use('en')
    this.selectedLanguage = 'en';
    localStorage.setItem('language', 'en')
  }

}
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.dropdownOpen = false;
    this.translate.use(lang);
    const message = this.translate.instant('toast.success.operation_successful');
    localStorage.setItem('language', lang)
    this.toastService.show(message, 'success');
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.dropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
