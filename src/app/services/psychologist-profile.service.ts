import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PsychologistProfile } from '../models/psychologist-profile';
import { WorkingHourDTO } from '../models/working-hour';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PsychologistProfileService {
  private baseUrl = `${environment.apiUrl}`;

  private profileCompletionStatus = new BehaviorSubject<boolean>(true);
  profileCompletionStatus$ = this.profileCompletionStatus.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<PsychologistProfile> {
    return this.http.get<PsychologistProfile>(
      `${this.baseUrl}/psychologists/${userId}/profile`
    );
  }

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

  replaceWorkingHours(userId: number, dtos: WorkingHourDTO[]): Observable<WorkingHourDTO[]> {
    return this.http.put<WorkingHourDTO[]>(
      `${this.baseUrl}/psychologists/${userId}/profile/hours`,
      dtos
    );
  }

  isProfileComplete(profile: PsychologistProfile): boolean {
    return !!(
      profile.specialty &&
      profile.location &&
      profile.consultationDuration &&
      profile.consultationPrice &&
      profile.document &&
      profile.description
    );
  }

  updateProfileCompletionStatus(profile: PsychologistProfile): void {
    const complete = this.isProfileComplete(profile);
    this.profileCompletionStatus.next(complete);
  }

  canAccessFeatures(user: { active: boolean }, profile: PsychologistProfile): boolean {
    return user.active && this.isProfileComplete(profile);
  }
}