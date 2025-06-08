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
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private checkEmailService: CheckEmailService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con validaciones
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Obtiene el token de los parámetros de la URL y valida que sea correcto
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.checkEmailService.validateResetToken(this.token).subscribe(isValid => {
          this.isTokenValid = isValid;
          // Si es válido, extrae el email del payload del token
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

  // Valida que la contraseña tenga al menos una mayúscula, un número y un símbolo
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    return hasUpper && hasNumber && hasSymbol ? null : { invalidPassword: true };
  }

  // Valida que ambas contraseñas coincidan
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // Muestra un toast con el mensaje y color indicado
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color
    });
    await toast.present();
  }

  // Envía la nueva contraseña si el formulario es válido y el token también
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