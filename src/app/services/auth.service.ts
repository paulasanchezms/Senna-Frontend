import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl: string;

  constructor(private http: HttpClient) {
    // Detectamos si estamos en localhost o en producción
    if (window.location.hostname === 'localhost') {
      this.baseUrl = 'http://localhost:8080/api/auth';
    } else {
      this.baseUrl = 'https://senna-production-45cb.up.railway.app/api/auth';
    }
  }

  /** Registro de paciente → POST /api/auth/register */
  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/register`,
      data
    );
  }

  /** Registro de psicólogo → POST /api/auth/register/psychologist */
  registerPsychologist(data: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/register/psychologist`,
      data
    );
  }

  /** Login común para todos los usuarios */
  login(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      data
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
      // Ajusta la clave al claim que uses, e.g. 'sub' o 'userId'
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
    return !!localStorage.getItem('authToken');
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
      console.log('Payload del token:', payload);
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