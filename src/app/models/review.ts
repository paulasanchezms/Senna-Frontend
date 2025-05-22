// models/review.ts
export interface ReviewDTO {
  id: number;
  rating: number;
  comment: string;
  patientName: string;
  createdAt: string;
}

export interface CreateReviewDTO {
  psychologistId: number;
  rating: number;
  comment: string;
}