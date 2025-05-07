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
  register(data: FormData): Observable<AuthResponse> {
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

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}