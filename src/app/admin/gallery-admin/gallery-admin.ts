import {Component, inject} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {AdminService} from '../../services/admin.service';
import { HttpEventType } from '@angular/common/http';




@Component({
  selector: 'app-gallery-admin',
  imports: [

    AsyncPipe
  ],
  templateUrl: './gallery-admin.html',
  styleUrl: './gallery-admin.scss'
})
export class GalleryAdmin {
adminService = inject(AdminService);
  uploadProgress: any;
  images = this.adminService.allImages();

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const fileArray = Array.from(files);

      // Reset progress tracking
      this.uploadProgress = fileArray.map(() => 0);

      this.adminService.addImages(fileArray).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            // Track total progress across all files
            const percentDone = Math.round((100 * event.loaded) / event.total);
            this.uploadProgress = fileArray.map(() => percentDone);
          } else if (event.type === HttpEventType.Response) {
            console.log('Upload complete:', event.body);

            this.uploadProgress = fileArray.map(() => 100);
            this.images = this.adminService.allImages();
          }
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.uploadProgress = fileArray.map(() => null);
        },
      });
    }
  }



  deleteImage(id:any){
    const confirmed = window.confirm('Are you sure you want to delete this news item?');

    if (!confirmed) {
      return; // User cancelled
    }

    this.adminService.deleteImage(id).subscribe(() => {
      this.images = this.adminService.allImages();
    });
  }

}
