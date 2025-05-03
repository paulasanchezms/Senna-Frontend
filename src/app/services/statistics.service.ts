import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatisticsResponse {
  totalEntries: number;
  moodCounts: { [key: string]: number };
  symptomCounts: { [key: string]: number };
  weeklyMoodLevels: number[];
  monthlyMoodLevels: number[];
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = 'http://localhost:8080/api/statistics';

  constructor(private http: HttpClient) {}

  getWeeklyStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/weekly`);
  }

  getMonthlyStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/monthly`);
  }
}