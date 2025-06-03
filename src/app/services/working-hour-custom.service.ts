import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkingHourCustomDTO } from '../models/working-hour-custom';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkingHourCustomService {
  private baseUrl = `${environment.apiUrl}/working-hours/custom`;

  constructor(private http: HttpClient) {}

  getCustomHours(userId: number, date: string): Observable<WorkingHourCustomDTO[]> {
    return this.http.get<WorkingHourCustomDTO[]>(
      `${this.baseUrl}?userId=${userId}&date=${date}`
    );
  }

  replaceCustomHours(
    userId: number,
    date: string,
    hours: WorkingHourCustomDTO[]
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}?userId=${userId}&date=${date}`,
      hours
    );
  }
}
