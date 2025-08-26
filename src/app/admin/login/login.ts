import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {AdminService} from '../../services/admin.service';
import {Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../shared/toast.service';
import {ToasterComponent} from '../../shared/notify/notify';
import {Role} from '../../enum/roles.enum';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    ToasterComponent,
    TranslatePipe
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  adminService = inject(AdminService);
  translate = inject(TranslateService);
  toastService = inject(ToastService);

router= inject(Router)
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.adminService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          // Assuming your API returns a token in response.token
          if (response.accessToken) {
            localStorage.setItem('authToken', JSON.stringify(response));
            if(response?.role === Role.chef){
              this.router.navigate(['auth/admin/daily-plate']);
            }else{
              this.router.navigate(['auth/admin/dashboard']); // Navigate to dashboard
            }

            const message = this.translate.instant('toast.success.operation_successful');
            this.toastService.show(message, 'success');
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          const message = this.translate.instant('toast.warning.check_input');
          this.toastService.show(message, 'info');
          // Optionally, show a notification to the user
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
