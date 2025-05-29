import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CheckEmailService } from 'src/app/services/check-email.service';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  recoverForm: FormGroup;
  showAlert: boolean = false;
  isSuccess: boolean | null = null;

  alertButtons = [{
    text: 'Aceptar',
    handler: () => {
      this.showAlert = false;
      this.isSuccess = null;
      this.cdr.detectChanges();
    }
  }];

  constructor(
    private fb: FormBuilder,
    private checkEmailService: CheckEmailService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.customEmailValidator()
      ]],
    });
  }

  // Validator definido como función que retorna función para mantener contexto de `this`
  customEmailValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return !emailRegex.test(email) ? { invalidEmail: true } : null;
    };
  }

  onSubmit(): void {
    if (this.recoverForm.valid) {
      const email = this.recoverForm.value.email;

      this.checkEmailService.sendResetEmail(email).subscribe(success => {
        this.isSuccess = success;
        this.showAlert = true;
        this.hideAlertsAfterDelay();

        if (success) {
          this.recoverForm.reset();
        }
      }, error => {
        console.error('Error al enviar el email de recuperación:', error);
        this.isSuccess = false;
        this.showAlert = true;
        this.hideAlertsAfterDelay();
      });
    }
  }

  hideAlertsAfterDelay(): void {
    setTimeout(() => {
      this.showAlert = false;
      this.isSuccess = null;
      this.cdr.detectChanges();
    }, 3500);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}