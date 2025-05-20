import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ReviewService } from 'src/app/services/review.service';
import { UserResponseDTO } from 'src/app/models/user';
import { ReviewDTO } from 'src/app/models/review';

@Component({
  standalone: false,
  selector: 'app-public-psychologist-profile',
  templateUrl: './public-psychologist-profile.page.html',
  styleUrls: ['./public-psychologist-profile.page.scss'],
})
export class PublicPsychologistProfilePage implements OnInit {
  psychologistId!: number;
  psychologist!: UserResponseDTO;
  defaultAvatar = 'assets/default-avatar.png';

  // Valoración
  hasRated = false;
  rating = 0;
  comment = '';

  reviewsPerPage = 5;
  currentPage = 1;

  reviews: ReviewDTO[] = [];

  averageRating: number = 0;
  visibleReviews: ReviewDTO[] = [];
  pageSize = 5;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit() {
    this.psychologistId = +this.route.snapshot.paramMap.get('id')!;

    this.userService.getPsychologistById(this.psychologistId).subscribe({
      next: (data) => (this.psychologist = data),
    });

    this.loadReviews();
  }

  setRating(value: number) {
    this.rating = value;
  }

  submitReview() {
    if (!this.rating || !this.comment.trim()) return;
  
    this.reviewService
      .createReview({
        psychologistId: this.psychologistId,
        rating: this.rating,
        comment: this.comment.trim(),
      })
      .subscribe({
        next: (newReview) => {
          this.hasRated = true;
  
          // Actualiza la lista de reseñas localmente
          const reviewToAdd: ReviewDTO = {
            ...newReview,
            createdAt: new Date().toISOString(),
            patientName: 'Tú' // O el nombre real si lo tienes disponible
          };
  
          this.reviews.unshift(reviewToAdd);
          this.visibleReviews = this.reviews.slice(0, this.visibleReviews.length + 1);
          this.calculateAverageRating();
  
          // Limpia los campos
          this.comment = '';
          this.rating = 0;
        },
        error: (err) => {
          console.error(err);
          alert('Ya has valorado a este profesional o ha ocurrido un error.');
        },
      });
  }

  loadReviews() {
    this.reviewService.getReviews(this.psychologistId).subscribe((res) => {
      this.reviews = res;
      this.visibleReviews = this.reviews.slice(0, this.pageSize);
      this.calculateAverageRating();
    });
  }

  showMore() {
    const next = this.visibleReviews.length + this.pageSize;
    this.visibleReviews = this.reviews.slice(0, next);
  }

  calculateAverageRating() {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.reviews.length;
  }

  goToPsychologistSchedule(id_user: number) {
    this.router.navigate(['/schedule-appointment', id_user]);
  }
}
