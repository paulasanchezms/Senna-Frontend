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
  private baseUrl = 'http://localhost:8080/api/statistics';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene estadísticas semanales.
   * Si year y week están definidos, los envía como query params
   * para recuperar la semana concreta; si no, trae la semana actual.
   */
  getWeeklyStatistics(year?: number, week?: number): Observable<StatisticsResponse> {
    let params = new HttpParams();
    if (year != null) {
      params = params.set('year', year.toString());
    }
    if (week != null) {
      params = params.set('week', week.toString());
    }
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/weekly`, { params });
  }

  /**
   * Obtiene estadísticas mensuales.
   * Si year y month están definidos, los envía como query params
   * para recuperar el mes concreto; si no, trae el mes actual.
   */
  getMonthlyStatistics(year?: number, month?: number): Observable<StatisticsResponse> {
    let params = new HttpParams();
    if (year != null) {
      params = params.set('year', year.toString());
    }
    if (month != null) {
      params = params.set('month', month.toString());
    }
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/monthly`, { params });
  }
}