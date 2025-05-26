import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Symptom {
  id: number;
  name: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class SymptomService {
  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/symptoms'
    : 'https://senna-production-45cb.up.railway.app/api';

  constructor(private http: HttpClient) {}

  getAllSymptoms(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.baseUrl);
  }
}