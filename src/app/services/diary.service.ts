import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiaryEntryDTO {
  date: string;
  moodIds: number[];
  symptomIds: number[];
  notes: string;
  moodLevel: number;
}


export interface DiaryEntryResponseDTO {
  id: number;
  date: string;
  moods: { id: number; name: string }[];
  symptoms: { id: number; name: string }[]; 
  notes: string;
  user: UserResponseDTO;
  moodLevel: number;
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
  private baseUrl = 'http://localhost:8080/api/diary';
  private moodsUrl = 'http://localhost:8080/api/moods';
  private symptomsUrl = 'http://localhost:8080/api/symptoms';

  constructor(private http: HttpClient) {}

  getAllEntries(): Observable<DiaryEntryResponseDTO[]> {
    return this.http.get<DiaryEntryResponseDTO[]>(this.baseUrl);
  }

  getEntryByDate(date: string): Observable<DiaryEntryResponseDTO> {
    return this.http.get<DiaryEntryResponseDTO>(`${this.baseUrl}/date/${date}`);
  }

  createEntry(entry: DiaryEntryDTO): Observable<DiaryEntryResponseDTO> {
    return this.http.post<DiaryEntryResponseDTO>(this.baseUrl, entry);
  }

  updateEntry(id: number, entry: DiaryEntryDTO): Observable<DiaryEntryResponseDTO> {
    return this.http.put<DiaryEntryResponseDTO>(`${this.baseUrl}/entry/${id}`, entry);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/entry/${id}`);

  }

  getMoods(): Observable<any[]> {
    return this.http.get<any[]>(this.moodsUrl);
  }

  getSymptoms(): Observable<any[]> {
    return this.http
    
    .get<any[]>(this.symptomsUrl);
  }

  getEntryForPatientByDate(patientId: number, date: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/psychologist/patient/${patientId}?date=${date}`);
  }

}