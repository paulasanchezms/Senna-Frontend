import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface WorkingHourDTO {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

@Injectable({ providedIn: 'root' })
export class WorkingHourService {
  private baseUrl = `${environment.apiUrl}/psychologists`;

  constructor(private http: HttpClient) {}

  getWorkingHours(userId: number): Observable<WorkingHourDTO[]> {
    return this.http.get<WorkingHourDTO[]>(
      `${this.baseUrl}/${userId}/profile/hours`
    );
  }

  createWorkingHour(userId: number, dto: WorkingHourDTO): Observable<WorkingHourDTO> {
    return this.http.post<WorkingHourDTO>(
      `${this.baseUrl}/${userId}/profile/hours`,
      dto
    );
  }

  updateWorkingHour(userId: number, hourId: number, dto: WorkingHourDTO): Observable<WorkingHourDTO> {
    return this.http.put<WorkingHourDTO>(
      `${this.baseUrl}/${userId}/profile/hours/${hourId}`,
      dto
    );
  }

  deleteWorkingHour(userId: number, hourId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${userId}/profile/hours/${hourId}`
    );
  }

  replaceWorkingHours(userId: number, dtos: WorkingHourDTO[]): Observable<WorkingHourDTO[]> {
    return this.http.put<WorkingHourDTO[]>(
      `${this.baseUrl}/${userId}/profile/hours`,
      dtos
    );
  }
}