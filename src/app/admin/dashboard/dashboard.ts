import {
  Component,
  ElementRef,
  HostListener,
  inject,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../shared/toast.service';
import {ToasterComponent} from '../../shared/notify/notify';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle, UpperCasePipe} from '@angular/common';
import {Popover} from 'primeng/popover';
import {Gallery} from '../../client/gallery/gallery';
import {Contact} from '../../client/contact/contact';
import {AdminContact} from '../admin-contact/admin-contact';
import {QrReader} from '../qr-reader/qr-reader';
import {Reservations} from '../reservations/reservations';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    TranslatePipe,
    ToasterComponent,
    FormsModule,
    UpperCasePipe,
    NgStyle,
    NgClass,
    NgForOf,
    NgIf,
    Popover,
    Gallery,
    Contact,
    AdminContact,
    QrReader,
    Reservations
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  translate = inject(TranslateService)
  toastService = inject(ToastService);
  router = inject(Router)

  language = localStorage.getItem('language');
  user = JSON.parse(<string>localStorage.getItem('authToken')) || null;
  private previousBox!: null | number;

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
  posX = 180;
  posY = 180;
  speed = 2;
  keys: Record<string, boolean> = {};

  // Define boxes
  boxes:any = [
    { id: 1, label: 'Contacts', x: 5, y: 50, width: 56, height: 56 },
    { id: 2, label: 'Scan QR', x: 5, y: 144, width: 56, height: 56 },
    { id: 3, label: 'Reservation', x: 5, y: 240, width: 56, height: 56 }
  ];
  currentBox: number | null = null; // currently on which box

  showPopup = false; // controls popup display

  ngOnInit() {
    this.animate();
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.keys[event.key] = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    this.keys[event.key] = false;
  }

  isMoving(): boolean {
    return this.keys['ArrowUp'] || this.keys['ArrowDown'] || this.keys['ArrowLeft'] || this.keys['ArrowRight'];
  }

  animate() {
    if (this.keys['ArrowUp']) this.posY -= this.speed;
    if (this.keys['ArrowDown']) this.posY += this.speed;
    if (this.keys['ArrowLeft']) this.posX -= this.speed;
    if (this.keys['ArrowRight']) this.posX += this.speed;

    this.posX = Math.max(0, Math.min(this.posX, 360));
    this.posY = Math.max(0, Math.min(this.posY, 360));

    this.checkBoxCollision();

    requestAnimationFrame(() => this.animate());
  }

  checkBoxCollision() {
    this.currentBox = null;
    const player = { x: this.posX, y: this.posY, width: 48, height: 48 };

    for (const box of this.boxes) {
      if (
        player.x < box.x + box.width &&
        player.x + player.width > box.x &&
        player.y < box.y + box.height &&
        player.y + player.height > box.y
      ) {
        this.currentBox = box.id;
        break;
      }
    }

    if (this.currentBox !== this.previousBox) {
      if (this.currentBox===1) {
        this.showPopup = true; // show popup
      } else {
        this.showPopup = false; // hide popup when leaving
      }
      this.previousBox = this.currentBox;
    }
  }
}
