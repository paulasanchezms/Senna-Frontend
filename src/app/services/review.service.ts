// services/review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateReviewDTO, ReviewDTO } from '../models/review';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api/reviews'
    : 'https://senna-production-45cb.up.railway.app/api';

  constructor(private http: HttpClient) {}

  createReview(dto: CreateReviewDTO): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(this.baseUrl, dto);
  }

  getReviews(psychologistId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/psychologist/${psychologistId}`);
  }
}