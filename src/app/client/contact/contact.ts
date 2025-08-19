import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,

  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  loading = signal(false);
  sent = signal(false);
  error = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
    consent: [false, [Validators.requiredTrue]],
  });

  touched(control: keyof typeof this.form.controls) {
    const c = this.form.controls[control];
    return c.touched || c.dirty;
  }

  submit() {
    this.error.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    // Replace with real HTTP call
    const payload = this.form.value;
    // Example POST
    this.http.post('', payload).subscribe({
      next: () => {
        this.sent.set(true);
        this.loading.set(false);
      },
      error: () => {
        // Fallback: simulate success when no backend exists
        // Comment out the next 3 lines when you have a real API.
        this.sent.set(true);
        this.loading.set(false);
        // If you prefer to show an error by default, uncomment:
        // this.error.set(true);
      }
    });
  }
}

