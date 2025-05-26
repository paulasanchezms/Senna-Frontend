import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateReviewDTO, ReviewDTO } from '../models/review';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  createReview(dto: CreateReviewDTO): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(this.baseUrl, dto);
  }

  getReviews(psychologistId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/psychologist/${psychologistId}`);
  }
}