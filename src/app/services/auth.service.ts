import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /** Registro de paciente */
  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      catchError((error: any) => {
        const message = error.error?.message || 'Ocurrió un error inesperado durante el registro.';
        return throwError(() => new Error(message));
      })
    );
  }

  /** Registro de psicólogo*/
  registerPsychologist(data: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/psychologist`, data).pipe(
      catchError((error: any) => {
        const message = error.error?.message || 'No se pudo registrar el perfil profesional.';
        return throwError(() => new Error(message));
      })
    );
  }

  /** Login común para todos los usuarios */
  login(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      data
    ).pipe(
      catchError((error: any) => {
        const customMessage = error.status === 403
          ? 'Correo o contraseña incorrectos'
          : 'Error inesperado al iniciar sesión';
        return throwError(() => new Error(customMessage));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /** Extrae el ID de usuario del token JWT */
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId ?? (payload.sub ? +payload.sub : null);
    } catch (e) {
      console.error('Error al decodificar JWT', e);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch (e) {
      console.error('Error decodificando token', e);
      return null;
    }
  }

  getCurrentUser(): { id_user: number; role: string; name?: string; email?: string } | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id_user: payload.userId ?? payload.sub ?? 0,
        role: payload.role,
        name: payload.name,
        email: payload.email
      };
    } catch (e) {
      console.error('Error al decodificar el token JWT', e);
      return null;
    }
  }
}