import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-daily-plate',
  templateUrl: './daily-plate.html',
  styleUrl: './daily-plate.scss',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, TranslateModule, NgClass]
})
export class DailyPlate {
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  dailyPlate: any;
  showModal = false;
  selectedPlate: any = null;
  plateForm!: FormGroup;
  today = new Date();
  selectedDay: any;
  constructor() {
    this.loadDailyPlate();
  }

  loadDailyPlate() {
    this.adminService.getPlates().subscribe({
      next: (data) => {
        this.dailyPlate = data;
      },
      error: (error) => {
        console.error('Error fetching daily plate:', error);
      }
    });
  }

  createNewPlate(day:any){
    this.showModal = true;
    this.plateForm = this.fb.group({
      dayId: this.selectedDay?.id,
      plate:[''],
      description:[''],
      price:[],
      imagePath:[]
    })
  }
    selectDay(day: any) {
      this.selectedDay = day;

    }

  savePlate() {
    if (this.plateForm.invalid) return;
    const updated = { ...this.selectedPlate, ...this.plateForm.value };
    const previousSelectedDayId = this.selectedDay?.id; // save the id before reload

    this.adminService.createDailyPlate(updated).subscribe({
      next: () => {
        this.showModal = false;

        // Reload daily plates
        this.adminService.getPlates().subscribe({
          next: (data) => {
            this.dailyPlate = data;

            // Restore previously selected day
            if (previousSelectedDayId) {
              const matchedDay = this.dailyPlate.find((d: { id: any; }) => d.id === previousSelectedDayId);
              if (matchedDay) {
                this.selectDay(matchedDay);
              }
            }
          },
          error: (error) => {
            console.error('Error fetching daily plate:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error updating plate:', error);
      },
    });
  }

  deletePlate(plate: any) {
    const confirmed = window.confirm('Are you sure you want to delete this plate?');
    if (!confirmed) return;

    const previousSelectedDayId = this.selectedDay?.id; // save the id before reload

    this.adminService.deleteDailyPlate(plate?.id).subscribe({
      next: () => {
        // Reload daily plates
        this.adminService.getPlates().subscribe({
          next: (data) => {
            this.dailyPlate = data;

            // Restore previously selected day
            if (previousSelectedDayId) {
              const matchedDay = this.dailyPlate.find((d: { id: any; }) => d.id === previousSelectedDayId);
              if (matchedDay) {
                this.selectDay(matchedDay);
              } else {
                this.selectedDay = null; // if deleted day was selected
              }
            }
          },
          error: (error) => {
            console.error('Error fetching daily plate:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error deleting plate:', error);
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
      this.plateForm.get('imagePath')?.patchValue(file)
      // Optionally, store file for upload on save
      this.selectedPlate.newImageFile = file;
    }
  }

}
