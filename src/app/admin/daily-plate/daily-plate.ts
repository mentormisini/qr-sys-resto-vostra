import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-daily-plate',
  templateUrl: './daily-plate.html',
  styleUrl: './daily-plate.scss',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, TranslateModule]
})
export class DailyPlate {
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  dailyPlate: any;
  showModal = false;
  selectedPlate: any = null;
  plateForm!: FormGroup;
  today = new Date();
  constructor() {
    this.loadDailyPlate();
  }

  loadDailyPlate() {
    this.adminService.getDailyPlate().subscribe({
      next: (data) => {
        this.dailyPlate = data;
      },
      error: (error) => {
        console.error('Error fetching daily plate:', error);
      }
    });
  }

  editPlate(plate: any) {
    this.selectedPlate = plate;
    this.plateForm = this.fb.group({
      plate: [plate.plate, Validators.required],
      description: [plate.description, Validators.required],
      price: [plate.price, [Validators.required, Validators.min(0)]]
    });
    this.showModal = true;
  }

  savePlate() {
    if (this.plateForm.invalid) return;
    const updated = { ...this.selectedPlate, ...this.plateForm.value };
    this.adminService.updateDailyPlate(updated).subscribe({
      next: () => {
        this.showModal = false;
        this.loadDailyPlate();
      },
      error: (error) => {
        console.error('Error updating plate:', error);
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedPlate = null;
    this.plateForm = this.fb.group({
      plate: [''],
      description: [''],
      price: ['']
    });
  }
  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedPlate.imagePath = e.target.result; // Preview
      };
      reader.readAsDataURL(file);
      // Optionally, store file for upload on save
      this.selectedPlate.newImageFile = file;
    }
  }

}
