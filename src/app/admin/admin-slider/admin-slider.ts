import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {AsyncPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-slider',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TranslatePipe
  ],
  templateUrl: './admin-slider.html',
  styleUrl: './admin-slider.scss'
})
export class AdminSlider {
  adminService = inject(AdminService);
  sliderForm!: FormGroup;
  sliders = this.adminService.getSliders();
  selectedFile: File | null = null;
  selectedImage:any;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.sliderForm = this.fb.group({
      image: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return; // no file selected

    this.selectedFile = file;

    // Update form control
    this.sliderForm.patchValue({ image: file });
    this.sliderForm.get('image')?.updateValueAndValidity();

    // Preview image
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.selectedImage = e.target?.result as string; // cast as string
    };
    reader.readAsDataURL(file);
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
  removeImage(): void {
    this.selectedImage = undefined;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = ''; // reset file input
  }
}
