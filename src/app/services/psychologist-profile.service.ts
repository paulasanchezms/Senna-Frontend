// src/app/services/psychologist-profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PsychologistProfile } from '../models/psychologist-profile';

@Injectable({
  providedIn: 'root'
})
export class PsychologistProfileService {
  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://senna-production-45cb.up.railway.app/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el perfil completo del psicólogo (incluye consultationDuration, price, etc.).
   */
  getProfile(userId: number): Observable<PsychologistProfile> {
    return this.http.get<PsychologistProfile>(
      `${this.baseUrl}/psychologists/${userId}/profile`
    );

    
  }

  /**
   * Actualiza el perfil profesional del psicólogo.
   */
  updateProfile(userId: number, data: Partial<PsychologistProfile>): Observable<PsychologistProfile> {
    return this.http.put<PsychologistProfile>(
      `${this.baseUrl}/psychologists/${userId}/profile`,
      data
    );
  }
}