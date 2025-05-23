import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentDTO, AppointmentResponseDTO } from '../models/appointment';
import { UserResponseDTO } from '../models/user';

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
    return this.http.get<string[]>(`${this.baseUrl}/psychologists/${psychologistId}/available-times`, { params });  }

  getAvailableTimesForWeek(psychologistId: number, startDate: string, endDate: string): Observable<{ [date: string]: string[] }> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
  
      return this.http.get<{ [date: string]: string[] }>(`${this.baseUrl}/psychologists/${psychologistId}/available-times/week`, { params });  }

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
}
