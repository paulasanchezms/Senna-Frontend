import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckEmailService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Envía un correo con el enlace de recuperación
   */
  sendResetEmail(email: string): Observable<boolean> {
    const url = `${this.apiUrl}/send-reset-password-email`;
    return this.http.post<any>(url, { email }).pipe(
      map(response => response.message === 'Correo de recuperación enviado correctamente.'),
      catchError(error => {
        console.error('Error al enviar el email:', error);
        return of(false);
      })
    );
  }

  /**
   * Valida el token recibido por el usuario (JWT)
   */
  validateResetToken(token: string): Observable<boolean> {
    const url = `${this.apiUrl}/validate-reset-token`;
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });

    // Guardar el token en localStorage por si se necesita al cambiar la contraseña
    localStorage.setItem('resetToken', token);

    return this.http.post<any>(url, token, { headers }).pipe(
      map(response => response.message === 'Token válido'),
      catchError(error => {
        console.error('Token inválido o expirado:', error);
        return of(false);
      })
    );
  }

  /**
   * Cambia la contraseña usando el token previamente validado
   */
  changePassword(newPassword: string): Observable<boolean> {
    const url = `${this.apiUrl}/change-password`;
    const token = localStorage.getItem('resetToken') || '';
    const body = { token, newPassword };

    return this.http.put<any>(url, body).pipe(
      map(response => response.message === 'Contraseña actualizada correctamente'),
      catchError(error => {
        console.error('Error al cambiar la contraseña:', error);
        return of(false);
      })
    );
  }
}