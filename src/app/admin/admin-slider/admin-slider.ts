import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-admin-slider',
  imports: [
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './admin-slider.html',
  styleUrl: './admin-slider.scss'
})
export class AdminSlider {
  adminService = inject(AdminService);
  sliderForm!: FormGroup;
  sliders = this.adminService.getSliders();
  selectedFile: File | null = null;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.sliderForm = this.fb.group({
      image: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }


  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.selectedFile = file;
    this.sliderForm.patchValue({ image: file });
    this.sliderForm.get('image')?.updateValueAndValidity();
  }

  addSlider() {
    if (this.sliderForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile); // single file
      formData.append('title', this.sliderForm.get('title')?.value);
      formData.append('description', this.sliderForm.get('description')?.value);

      this.adminService.uploadSlide(formData).subscribe({
        next: (res: any) => {

          this.sliderForm.reset();
          this.sliders = this.adminService.getSliders();
          this.selectedFile = null;
        },
        error: (err) => console.error(err)
      });
    }
  }

  deleteSlider(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this news item?');

    if (!confirmed) {
      return; // User cancelled
    }

    this.adminService.deleteSlider(id).subscribe(() => {
      this.sliders = this.adminService.getSliders();
    });
  }
}
