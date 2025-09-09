import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('qr-sys-resto');
  language = localStorage.getItem('language');
  constructor(private translate: TranslateService) {
      if(this.language){
        this.translate.use(this.language)
      }else{
        this.translate.use('fr')
        localStorage.setItem('language', 'fr')
      }

  }

  switchLanguage(lang: string) {
    this.translate.use(lang).subscribe();
  }

}
