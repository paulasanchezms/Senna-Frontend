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
  selectedDate!: string;    // formato: YYYY-MM-DD
  selectedTime!: string;    // formato: HH:mm
  duration: number = 60;    // duración en minutos
  description: string = '';
  availableTimes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Obtener ID del psicólogo de la URL
    this.psychologistId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPsychologist();

    // Inicializar fecha al día de hoy y cargar franjas
    this.selectedDate = new Date().toISOString().slice(0, 10);
    this.fetchAvailableTimes();
  }

  /** Se dispara al cambiar la fecha en el calendario */
  onDateChange() {
    this.fetchAvailableTimes();
  }

  /** Llama al servicio para obtener horas disponibles del psicólogo */
  private fetchAvailableTimes() {
    if (!this.selectedDate) {
      this.availableTimes = [];
      return;
    }

    this.appointmentService
      .getAvailableTimes(this.psychologistId, this.selectedDate)
      .subscribe({
        next: times => this.availableTimes = times,
        error: err => {
          console.error('Error al obtener horas disponibles', err);
          this.availableTimes = [];
        }
      });
  }

  /** Carga datos del psicólogo */
  loadPsychologist() {
    this.userService.getPsychologistById(this.psychologistId).subscribe({
      next: data => this.psychologist = data,
      error: err => console.error('Error cargando psicólogo', err),
    });
  }

  /** Reserva cita con la hora y fecha seleccionadas */
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
      status: 'PENDIENTE',
    };

    this.appointmentService.scheduleAppointment(appointment).subscribe({
      next: response => {
        console.log('Cita creada:', response);
        this.router.navigate(['/confirm-appointment'], {
          state: { appointment: response }
        });
      },
      error: err => {
        console.error('Error al crear cita', err);
        alert('Hubo un problema al crear la cita. Inténtalo de nuevo.');
      }
    });
  }

  /** Calcula la hora de fin sumando this.duration */
  computeEndTime(startTime: string): string {
    if (!startTime) { return ''; }
    const [hh, mm] = startTime.split(':').map(n => parseInt(n, 10));
    const date = new Date();
    date.setHours(hh, mm + this.duration);

    const endH = date.getHours().toString().padStart(2, '0');
    const endM = date.getMinutes().toString().padStart(2, '0');
    return `${endH}:${endM}`;
  }
}
