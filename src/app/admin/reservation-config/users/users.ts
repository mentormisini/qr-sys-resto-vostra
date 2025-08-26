import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf} from '@angular/common';
import {AdminService} from '../../../services/admin.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../../shared/toast.service';
import {ToasterComponent} from '../../../shared/notify/notify';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,

    AsyncPipe,
    ToasterComponent,
    TranslatePipe
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  adminService= inject(AdminService);
  users$ = this.adminService.getAllUsers();
  translate = inject(TranslateService);
  toastService = inject(ToastService);
  form = {
    email: '',
    password: '',
    role: 'admin'
  };

  users: { email: string; role: string }[] = [];

  onSubmit() {
    if(this.form.email && this.form.password) {


      this.adminService.createUser(this.form).subscribe(() => {
        const message = this.translate.instant('toast.success.operation_successful');
        this.toastService.show(message, 'success');
        this.users$ = this.adminService.getAllUsers();
      })
    }
  }
  deleteUser(user: any) {
    const confirmed = window.confirm(
      this.translate.instant('toast.confirm.delete_area')
    );
    if (!confirmed) return;
    this.adminService.deleteUser(user?.id).subscribe(()=>{
      const message = this.translate.instant('toast.success.operation_successful');
      this.toastService.show(message, 'error');
      this.users$ = this.adminService.getAllUsers();
    })
  }
}
