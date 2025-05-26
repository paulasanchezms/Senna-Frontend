import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getPendingPsychologists(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/pending-psychologists`);
  }

  approvePsychologist(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/approve-psychologist/${id}`, {});
  }

  rejectPsychologist(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/reject-psychologist/${id}`, {});
  }

  banUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/ban-user/${id}`, {});
  }

  getAllActiveUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.baseUrl}/users`);
  }
}