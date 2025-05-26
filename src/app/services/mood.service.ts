import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private baseUrl = `${environment.apiUrl}/moods`;

  constructor(private http: HttpClient) {}

  getAllMoods(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createMood(mood: { name: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl, mood);
  }

  deleteMood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}