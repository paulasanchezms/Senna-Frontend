import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

   getPsychologists(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/psychologists`);
  }

  getPsychologistById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.baseUrl}/${id}`);
  }

  searchPsychologistsBySpecialty(specialty: string): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/psychologists/search?specialty=${specialty}`);
  }

  me(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.baseUrl}/me`);
  }
}