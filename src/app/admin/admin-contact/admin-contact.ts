import {Component, inject} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {AdminService} from '../../services/admin.service';
import {ToastService} from '../../shared/toast.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToasterComponent} from '../../shared/notify/notify';

@Component({
  selector: 'app-admin-contact',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    ToasterComponent,
    TranslatePipe
  ],
  templateUrl: './admin-contact.html',
  styleUrl: './admin-contact.scss'
})
export class AdminContact {
adminService = inject(AdminService);
toastService = inject(ToastService);
translate = inject(TranslateService);
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phones: this.fb.array([]), // start empty, will populate dynamically
      address: ['', Validators.required]
    });

    this.adminService.getContacts().subscribe(contacts => {
      this.contactForm.patchValue({
        email: contacts.email,
        address: contacts.address
      });

      // Clear existing phones and add from API
      this.phones.clear();
      contacts.phones.forEach((phone: any) => {
        this.phones.push(this.fb.control(phone, Validators.required));
      });
    });
  }

// Getter for phones FormArray
  get phones() {
    return this.contactForm.get('phones') as FormArray;
  }

// Add a new phone field
  addPhone() {
    this.phones.push(this.fb.control('', Validators.required));
  }

// Remove phone by index
  removePhone(index: number) {
    this.phones.removeAt(index);
  }
  onSubmit() {
    this.adminService.patchContacts(this.contactForm.value).subscribe(contacts => {
      const message = this.translate.instant('toast.success.category_updated');
      this.toastService.show(message, 'success');
    })
  }
}
