import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkingHourDTO {
  dayOfWeek: number;
  startTime: string;
  endTime:   string;
}

@Injectable({ providedIn: 'root' })
export class WorkingHourService {
  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://senna-production-45cb.up.railway.app/api';

  constructor(private http: HttpClient) {}

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
  
}