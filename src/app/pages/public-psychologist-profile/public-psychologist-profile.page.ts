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
  reviews: ReviewDTO[] = [];
  visibleReviews: ReviewDTO[] = [];
  pageSize = 5;
  averageRating = 0;

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
    if (!this.hasRated) this.rating = value;
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
          this.comment = '';
          this.rating = 0;

          const reviewToAdd: ReviewDTO = {
            ...newReview,
            createdAt: new Date().toISOString(),
            patientName: 'Tú'
          };

          this.reviews.unshift(reviewToAdd);
          this.visibleReviews = this.reviews.slice(0, this.pageSize);
          this.calculateAverageRating();
        },
        error: (err) => {
          console.error(err);
          alert('Ya has valorado a este profesional o ha ocurrido un error.');
        },
      });
  }

  loadReviews() {
    this.reviewService.getReviews(this.psychologistId).subscribe((res) => {
      this.reviews = res.filter(r => r.comment?.trim() && r.rating);
      this.visibleReviews = this.reviews.slice(0, this.pageSize);
      this.calculateAverageRating();
  
      const youAlreadyRated = this.reviews.some(r => r.patientName === 'Tú');
      if (youAlreadyRated) {
        this.hasRated = true;
      }
    });
  }

  showMore() {
    const next = this.visibleReviews.length + this.pageSize;
    this.visibleReviews = this.reviews.slice(0, next);
  }

  calculateAverageRating() {
    if (!this.reviews.length) {
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