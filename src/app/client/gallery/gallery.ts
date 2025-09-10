import {Component, inject} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {AdminService} from '../../services/admin.service';
import {TranslatePipe} from '@ngx-translate/core';
import {animate, group, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-gallery',
  imports: [

    TranslatePipe
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
  animations: [
    trigger('categorySwitch', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Gallery {
  adminService = inject(AdminService);
  uploadProgress: any;
  images:any;
  selectedIndex: number | null = null;
  animationKey = 0;

  ngOnInit(){
    this.adminService.allImages().subscribe((data: any) => {
      this.images = data;
      this.animationKey++;
    })
  }


  get selectedImage(): string | null {
    return this.selectedIndex !== null ? this.images[this.selectedIndex]?.imagePath : null;
  }

  openModal(index: number) {
    this.selectedIndex = index;
  }

  closeModal() {
    this.selectedIndex = null;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.selectedIndex !== null) {
      this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
    }
  }

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.selectedIndex !== null) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.images.length) % this.images.length;
    }
  }
}
