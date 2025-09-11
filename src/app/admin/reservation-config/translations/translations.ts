import {Component, inject, signal} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {AsyncPipe, JsonPipe, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../../shared/toast.service';

@Component({
  selector: 'app-translations',
  imports: [

    FormsModule,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './translations.html',
  styleUrl: './translations.scss'
})
export class Translations {
  adminServices = inject(AdminService)
  translate = inject(TranslateService);
  toastService = inject(ToastService);
  allTranslations$:any;
  newTranslation: any = { key: '', value: '' };
  languages = signal([
    { key: 'en', value: 'English' },
    { key: 'fr', value: 'Français ' },
    { key: 'it', value: 'Italiao' }
  ]);
  selectedLanguage = signal('en');
  ngOnInit() {
    this.getTranslations(this.selectedLanguage())
  }
  selectLanguage(lang: any) {
    this.selectedLanguage.set(lang?.key);
    this.getTranslations(this.selectedLanguage())
  }
  getTranslations(lang:string){
    this.adminServices.getTranslations(lang).subscribe(resp=>{
      this.allTranslations$ = Object.keys(resp).map(key => ({ key, value: resp[key] })).reverse(); // last keys appear first;
    })
  }
  updateTranslation(t: any) {
    const payload ={
      key: t.key,
      value: t.value
    }

    this.adminServices.editTranslations(this.selectedLanguage(), payload).subscribe(()=>{
      this.getTranslations(this.selectedLanguage())
      const message = this.translate.instant('toast.success.operation_successful');
      this.toastService.show(message, 'info');
    })
  }

  addTranslation() {
    if (this.newTranslation.key && this.newTranslation.value) {
      this.adminServices.addTranslations(this.selectedLanguage(),this.newTranslation).subscribe(()=>{
        this.getTranslations(this.selectedLanguage());
        this.newTranslation = { key: '', value: '' };
        const message = this.translate.instant('toast.success.operation_successful');
        this.toastService.show(message, 'success');
      })
    } else {
      alert('Please enter both key and value');
    }
  }
}
