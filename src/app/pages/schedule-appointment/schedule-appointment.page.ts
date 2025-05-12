import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDTO } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { UserService } from 'src/app/services/user.service';
import { UserResponseDTO } from 'src/app/models/user';

@Component({
  standalone: false,
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.page.html',
})
export class ScheduleAppointmentPage implements OnInit {
  psychologistId!: number;
  psychologist!: UserResponseDTO;
  selectedDate!: string;
  selectedTime!: string;
  duration: number = 60;
  description: string = '';

  weeklyAvailability: { [date: string]: string[] } = {};
  availableTimes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.psychologistId = +this.route.snapshot.paramMap.get('id')!;
    this.selectedDate = new Date().toISOString().slice(0, 10);
    this.loadPsychologist();
    this.loadWeeklyAvailability();
  }

  onDateChange() {
    this.availableTimes = this.weeklyAvailability[this.selectedDate] || [];
  }

  loadPsychologist() {
    this.userService.getPsychologistById(this.psychologistId).subscribe({
      next: data => this.psychologist = data,
      error: err => console.error('Error cargando psicólogo', err),
    });
  }

  loadWeeklyAvailability() {
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10);
    const endDate = new Date(today.setDate(today.getDate() + 6)).toISOString().slice(0, 10);

    this.appointmentService.getAvailableTimesForWeek(this.psychologistId, startDate, endDate).subscribe({
      next: data => {
        this.weeklyAvailability = data;
        this.onDateChange(); // actualizar slots del día actual
      },
      error: err => {
        console.error('Error al cargar disponibilidad semanal', err);
        this.weeklyAvailability = {};
      }
    });
  }

  confirm() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Por favor, selecciona día y hora.');
      return;
    }

    const dateTime = `${this.selectedDate}T${this.selectedTime}`;
    const appointment: AppointmentDTO = {
      dateTime,
      duration: this.duration,
      description: this.description || 'Reserva realizada desde app',
      psychologistId: this.psychologistId,
      status: 'PENDIENTE'
    };

    this.router.navigate(['/confirm-appointment'], {
      state: {
        appointment,
        psychologist: this.psychologist
      }
    });
  }

  computeEndTime(startTime: string): string {
    if (!startTime) return '';
    const [hh, mm] = startTime.split(':').map(n => parseInt(n, 10));
    const date = new Date();
    date.setHours(hh, mm + this.duration);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}