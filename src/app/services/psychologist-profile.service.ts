// src/app/services/psychologist-profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PsychologistProfile } from '../models/psychologist-profile';
import { WorkingHourDTO } from '../models/working-hour';

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

  getWorkingHours(userId: number): Observable<WorkingHourDTO[]> {
    return this.http.get<WorkingHourDTO[]>(
      `${this.baseUrl}/psychologists/${userId}/profile/hours`
    );
  }

  createWorkingHour(userId: number, dto: WorkingHourDTO): Observable<WorkingHourDTO> {
    return this.http.post<WorkingHourDTO>(
      `${this.baseUrl}/psychologists/${userId}/profile/hours`,
      dto
    );
  }

  updateWorkingHour(userId: number, hourId: number, dto: WorkingHourDTO): Observable<WorkingHourDTO> {
    return this.http.put<WorkingHourDTO>(
      `${this.baseUrl}/psychologists/${userId}/profile/hours/${hourId}`,
      dto
    );
  }

  deleteWorkingHour(userId: number, hourId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/psychologists/${userId}/profile/hours/${hourId}`
    );
  }

  replaceWorkingHours(
    userId: number,
    dtos: WorkingHourDTO[]
  ): Observable<WorkingHourDTO[]> {
    return this.http.put<WorkingHourDTO[]>(
      `${this.baseUrl}/psychologists/${userId}/profile/hours`,
      dtos
    );
  }

  /**
 * Comprueba si el perfil del psicólogo está completo.
 */
isProfileComplete(profile: PsychologistProfile): boolean {
  return !!(profile.specialty &&
    profile.location &&
    profile.consultationDuration &&
    profile.consultationPrice &&
    profile.document &&
    profile.description);
}

/**
 * Devuelve true si el usuario está activo y aprobado por el administrador.
 */
canAccessFeatures(user: { active: boolean }, profile: PsychologistProfile): boolean {
  return user.active && this.isProfileComplete(profile);
}
}