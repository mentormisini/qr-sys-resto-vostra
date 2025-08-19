import {Component, inject} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-news',
  imports: [
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './admin-news.html',
  styleUrl: './admin-news.scss'
})
export class AdminNews {
  adminService = inject(AdminService);
  allNews$ = this.adminService.getNews();

  newsForm!: FormGroup;
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', [Validators.required]]
    });
  }

  addNews() {
    if (this.newsForm.valid) {
      const formData = new FormData();

      // Append text fields
      formData.append('title', this.newsForm.get('title')?.value);
      formData.append('description', this.newsForm.get('description')?.value);
      formData.append('createdDate', new Date().toISOString());

      // Append file
      const file = this.newsForm.get('image')?.value;
      if (file) {
        formData.append('image', file, file.name);
      }

      // Send the FormData to the service
      this.adminService.addNews(formData).subscribe(() => {
        this.allNews$ = this.adminService.getNews();
      });

      this.newsForm.reset();
      this.imagePreview = null;
    }
  }

  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        // Update the form control with the file object
        this.newsForm.patchValue({ image: file });
        this.newsForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  deleteNews(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this news item?');

    if (!confirmed) {
      return; // User cancelled
    }

    this.adminService.deleteNews(id).subscribe(() => {
      this.allNews$ = this.adminService.getNews();
    });
  }

}
