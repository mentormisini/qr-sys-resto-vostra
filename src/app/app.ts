import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('qr-sys-resto');
  constructor(private translate: TranslateService) {
    // Set default language
    firstValueFrom(this.translate.setDefaultLang('en'))
      .then(() => console.log('Default language set'))
      .catch(err => console.error('Failed to set default language', err));

    // Optionally, immediately use the default
    this.translate.use('en').subscribe();
  }

  switchLanguage(lang: string) {
    this.translate.use(lang).subscribe();
  }

}
