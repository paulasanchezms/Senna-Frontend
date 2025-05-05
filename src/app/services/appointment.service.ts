import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentDTO, AppointmentResponseDTO } from '../models/appointment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  

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
      `/api/psychologists/${psychologistId}/available-times`,
      { params }
    );
  }
}
