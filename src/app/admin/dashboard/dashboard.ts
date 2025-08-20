import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../shared/toast.service';
import {ToasterComponent} from '../../shared/notify/notify';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    TranslatePipe,
    ToasterComponent,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  translate = inject(TranslateService)
  toastService = inject(ToastService);
  router = inject(Router)

  language = localStorage.getItem('language');

  constructor() {
    if(this.language){
      this.translate.use(this.language)
    }else{
      this.translate.use('en')
      localStorage.setItem('language', 'en')
    }
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    const message = this.translate.instant('toast.success.operation_successful');
    this.toastService.show(message, 'success');
    localStorage.setItem('language', lang);
  }

  logOut(){
    localStorage.removeItem('authToken'); // Store token in localStorage
    this.router.navigate(['auth']);
  }
}
