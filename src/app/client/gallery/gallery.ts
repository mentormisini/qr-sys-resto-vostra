import {Component, inject} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-gallery',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery {
  adminService = inject(AdminService);
  uploadProgress: any;
  images:any;
  selectedIndex: number | null = null;

  ngOnInit(){
    this.adminService.allImages().subscribe((data: any) => {
      this.images = data;
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
