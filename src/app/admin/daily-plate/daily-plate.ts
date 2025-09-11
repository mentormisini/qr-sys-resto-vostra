import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ToasterComponent} from '../../shared/notify/notify';
import {ToastService} from '../../shared/toast.service';
import {Translations} from '../reservation-config/translations/translations';

@Component({
  selector: 'app-daily-plate',
  templateUrl: './daily-plate.html',
  styleUrl: './daily-plate.scss',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, NgClass, ToasterComponent, Translations]
})
export class DailyPlate {
  adminService = inject(AdminService);
  fb = inject(FormBuilder);
  dailyPlate: any;
  showModal = false;
  selectedPlate: any = null;
  plateForm!: FormGroup;
  today = new Date();
  translate = inject(TranslateService);
  toaster = inject(ToastService)
  selectedDay: any;
  showTranslations!: boolean;
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

    const formData = new FormData();
    formData.append('plate', this.plateForm.value.plate);
    formData.append('description', this.plateForm.value.description);
    formData.append('price', this.plateForm.value.price);
    formData.append('dayId', this.selectedDay?.id.toString());

    if (this.selectedPlate?.newImageFile) {
      formData.append('image', this.selectedPlate.newImageFile);
    }

    const previousSelectedDayId = this.selectedDay?.id;

    this.adminService.createDailyPlate(formData).subscribe({
      next: () => {
        this.showModal = false;

        // reload everything just like delete
        this.adminService.getPlates().subscribe({
          next: (data) => {
            this.dailyPlate = data;
            this.loadDailyPlate();
            const message = this.translate.instant('toast.success.operation_successful');
            this.toaster.show(message, 'success');
            if (previousSelectedDayId) {
              const matchedDay = this.dailyPlate.find((d: { id: any }) => d.id === previousSelectedDayId);
              if (matchedDay) {
                this.selectDay(matchedDay);
              }
            }
          },
          error: (err) => console.error('Error fetching daily plates:', err),
        });
      },
      error: (err) => console.error('Error saving plate:', err),
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
            this.loadDailyPlate();
            // Restore previously selected day
            if (previousSelectedDayId) {
              const matchedDay = this.dailyPlate.find((d: { id: any; }) => d.id === previousSelectedDayId);
              if (matchedDay) {
                this.selectDay(matchedDay);
                const message = this.translate.instant('toast.success.operation_successful');
                this.toaster.show(message, 'error');
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
      price: [''],
      imagePath:['']
    });
  }
  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (!this.selectedPlate) this.selectedPlate = {}; // ensure object exists
        this.selectedPlate.imagePath = e.target.result;
      };
      reader.readAsDataURL(file);

      // Ensure selectedPlate is not null
      if (!this.selectedPlate) this.selectedPlate = {};
      this.selectedPlate.newImageFile = file;
    }
  }
  removeImage(): void {
    this.selectedPlate.imagePath = undefined;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = ''; // reset file input
  }



}
