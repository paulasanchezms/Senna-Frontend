import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppointmentDTO, AppointmentResponseDTO } from '../models/appointment';
import { UserResponseDTO } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = `${environment.apiUrl}/appointments`;
  private pendingCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getPendingCountObservable(): Observable<number> {
    return this.pendingCount$.asObservable();
  }

  fetchAndUpdatePendingCount(): void {
    this.getPendingAppointmentsForPsychologist().subscribe({
      next: (appointments) => this.pendingCount$.next(appointments.length),
      error: () => this.pendingCount$.next(0)
    });
  }

  getPatientAppointments(): Observable<AppointmentResponseDTO[]> {
    return this.http.get<AppointmentResponseDTO[]>(`${this.baseUrl}/patient`);
  }

  getPsychologistAppointments(): Observable<AppointmentResponseDTO[]> {
    return this.http.get<AppointmentResponseDTO[]>(`${this.baseUrl}/psychologist`);
  }

  scheduleAppointment(dto: AppointmentDTO): Observable<AppointmentResponseDTO> {
    return this.http.post<AppointmentResponseDTO>(this.baseUrl, dto);
  }

  updateAppointment(id: number, dto: AppointmentDTO): Observable<AppointmentResponseDTO> {
    return this.http.put<AppointmentResponseDTO>(`${this.baseUrl}/${id}`, dto);
  }

  cancelAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAvailableTimes(psychologistId: number, date: string): Observable<string[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<string[]>(
      `${this.baseUrl}/psychologists/${psychologistId}/available-times`,
      { params }
    );
  }

  getAvailableTimesForWeek(psychologistId: number, startDate: string, endDate: string): Observable<{ [date: string]: string[] }> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<{ [date: string]: string[] }>(
      `${this.baseUrl}/psychologists/${psychologistId}/available-times/week`,
      { params }
    );
  }

  getPendingAppointmentsForPsychologist(): Observable<AppointmentResponseDTO[]> {
    return this.http.get<AppointmentResponseDTO[]>(`${this.baseUrl}/psychologist/pending`);
  }

  acceptAppointment(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/accept`, {});
  }

  rejectAppointment(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/reject`, {});
  }

  getPatientsForPsychologist(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/psychologist/patients`);
  }

  cancelAllWithPsychologist(psychologistId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cancel-by-psychologist/${psychologistId}`);
  }
}