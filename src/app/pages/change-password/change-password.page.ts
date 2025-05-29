import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CheckEmailService } from 'src/app/services/check-email.service';
import { ToastController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  form!: FormGroup;
  token: string = '';
  email: string = '';
  isTokenValid = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private checkEmailService: CheckEmailService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.checkEmailService.validateResetToken(this.token).subscribe(isValid => {
          this.isTokenValid = isValid;
          if (isValid) {
            try {
              const payload = JSON.parse(atob(this.token.split('.')[1]));
              this.email = payload.sub;
            } catch (err) {
              this.isTokenValid = false;
              this.showToast('El token es inválido.', 'danger');
            }
          } else {
            this.showToast('El enlace ha expirado o es inválido', 'danger');
          }
        });
      }
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    return hasUpper && hasNumber && hasSymbol ? null : { invalidPassword: true };
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color
    });
    await toast.present();
  }

  onSubmit() {
    if (this.form.invalid || !this.isTokenValid) return;

    const newPassword = this.form.value.newPassword;

    this.checkEmailService.changePassword( newPassword).subscribe(success => {
      if (success) {
        this.showToast('Contraseña actualizada correctamente', 'success');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else {
        this.showToast('No se pudo cambiar la contraseña', 'danger');
      }
    });
  }
}