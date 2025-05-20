import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponseDTO } from '../../models/user';

@Component({
  standalone:false,
  selector: 'app-public-psychologist-profile',
  templateUrl: './public-psychologist-profile.page.html',
  styleUrls: ['./public-psychologist-profile.page.scss']
})
export class PublicPsychologistProfilePage implements OnInit {
  psychologist!: UserResponseDTO;
  defaultAvatar = '/assets/default-avatar.png';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.userService.getPsychologistById(id).subscribe({
        next: (data) => {
          this.psychologist = data;
        },
        error: (err) => {
          console.error('Error al cargar el perfil público', err);
        }
      });
    }
  }

  goToPsychologistSchedule(id_user: number) {
    this.router.navigate(['/schedule-appointment', id_user]);
  }
}