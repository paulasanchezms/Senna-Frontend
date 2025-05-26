import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkingHourCustomDTO } from '../models/working-hour-custom';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkingHourCustomService {
  private baseUrl = `${environment.apiUrl}/working-hours/custom`;

  constructor(private http: HttpClient) {}

  getCustomHours(profileId: number, date: string): Observable<WorkingHourCustomDTO[]> {
    return this.http.get<WorkingHourCustomDTO[]>(
      `${this.baseUrl}?profileId=${profileId}&date=${date}`
    );
  }

  replaceCustomHours(
    profileId: number,
    date: string,
    hours: WorkingHourCustomDTO[]
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}?profileId=${profileId}&date=${date}`,
      hours
    );
  }
}