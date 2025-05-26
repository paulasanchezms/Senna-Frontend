import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '../models/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getPsychologists(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/psychologists`);
  }

  getPsychologistById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.baseUrl}/by-id/${id}`);
  }

  getPatientById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.baseUrl}/by-id/${id}`);
  }

  searchPsychologistsBySpecialty(specialty: string): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/psychologists/search?specialty=${specialty}`);
  }

  me(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.baseUrl}/me`);
  }

  updateMe(data: { phone?: string; photoUrl?: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me`, data);
  }

  uploadToImgBB(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ url: string }>(
      `${this.baseUrl}/upload-image`,
      formData
    ).pipe(
      map(res => res.url)
    );
  }

  acceptTerms(): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/accept-terms`, {});
  }
}