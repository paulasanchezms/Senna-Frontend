import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkingHourCustomDTO } from '../models/working-hour-custom';


@Injectable({ providedIn: 'root' })
export class WorkingHourCustomService {
  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://senna-production-45cb.up.railway.app/api';

  constructor(private http: HttpClient) {}

  getCustomHours(profileId: number, date: string): Observable<WorkingHourCustomDTO[]> {
    return this.http.get<WorkingHourCustomDTO[]>(
      `${this.baseUrl}/working-hours/custom?profileId=${profileId}&date=${date}`
    );
  }

  replaceCustomHours(
    profileId: number,
    date: string,
    hours: WorkingHourCustomDTO[]
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/working-hours/custom?profileId=${profileId}&date=${date}`,
      hours
    );
  }
}