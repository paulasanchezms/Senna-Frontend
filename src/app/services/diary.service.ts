import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface DiaryEntryDTO {
  date: string; // formato ISO: '2025-04-18'
  mood: string;
  symptoms: string;
  notes: string;
}

export interface DiaryEntryResponseDTO {
  id: number;
  date: string;
  mood: string;
  symptoms: string;
  notes: string;
  user: UserResponseDTO;
}

export interface UserResponseDTO {
  id_user: number;
  name: string;
  last_name: string;
  email: string;
  role: string;

  dni?: string;
  qualification?: string;
  specialty?: string;
  location?: string;
  document?: string;
}

@Injectable({
  providedIn: 'root'
})

export class DiaryService {
  private baseUrl = 'http://localhost:8080/api/diary-entries';

  constructor(private http: HttpClient) {}

  getEntryByDate(date: string): Observable<DiaryEntryResponseDTO> {
    return this.http.get<DiaryEntryResponseDTO>(`${this.baseUrl}/by-date/${date}`);
  }

  createEntry(entry: DiaryEntryDTO): Observable<any> {
    return this.http.post(this.baseUrl, entry);
  }
}