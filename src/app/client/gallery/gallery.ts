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
        group([
          // Animate old items out
          query(':leave', [
            stagger(-80, [
              animate(
                '400ms ease-in-out',
                style({ opacity: 0, transform: 'rotateY(45deg) translateY(-20px) scale(0.9)' })
              )
            ])
          ], { optional: true }),

          // Animate new items in
          query(':enter', [
            style({ opacity: 0, transform: 'rotateY(-45deg) translateY(20px) scale(0.9)' }),
            stagger(120, [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'rotateY(0) translateY(0) scale(1)' })
              )
            ])
          ], { optional: true })
        ])
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
