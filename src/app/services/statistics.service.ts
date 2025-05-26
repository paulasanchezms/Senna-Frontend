import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatisticsResponse {
  totalEntries: number;
  moodCounts: { [key: string]: number };
  symptomCounts: { [key: string]: number };
  weeklyMoodLevels: number[];
  monthlyMoodLevels: number[];
  daysInMonth: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/statistics'
    : 'https://senna-production-45cb.up.railway.app/api/statistics';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene estadísticas semanales.
   * Si year, week o patientId están definidos, los envía como query params.
   */
  getWeeklyStatistics(year?: number, week?: number, patientId?: number): Observable<StatisticsResponse> {
    let params = new HttpParams();
    if (year != null) {
      params = params.set('year', year.toString());
    }
    if (week != null) {
      params = params.set('week', week.toString());
    }
    if (patientId != null) {
      params = params.set('patientId', patientId.toString());
    }
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/weekly`, { params });
  }

  /**
   * Obtiene estadísticas mensuales.
   * Si year, month o patientId están definidos, los envía como query params.
   */
  getMonthlyStatistics(year?: number, month?: number, patientId?: number): Observable<StatisticsResponse> {
    let params = new HttpParams();
    if (year != null) {
      params = params.set('year', year.toString());
    }
    if (month != null) {
      params = params.set('month', month.toString());
    }
    if (patientId != null) {
      params = params.set('patientId', patientId.toString());
    }
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/monthly`, { params });
  }
}