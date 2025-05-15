import { Component } from '@angular/core';
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
export class ScheduleAppointmentPage {
  psychologistId!: number;
  psychologist!: UserResponseDTO;
  selectedDate!: string;
  selectedTime!: string;
  duration: number = 60;
  description: string = '';
  todayISO = new Date().toISOString().split('T')[0]; 

  weeklyAvailability: { [date: string]: string[] } = {};
  availableTimes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ionViewWillEnter() {
    this.psychologistId = +this.route.snapshot.paramMap.get('id')!;
    this.selectedDate = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD
    this.loadPsychologist();
    this.loadWeeklyAvailability();
  }

  onDateChange() {
    const allTimes = this.weeklyAvailability[this.selectedDate] || [];
    const now = new Date();
    const selectedDay = new Date(this.selectedDate + 'T00:00:00');
  
    this.availableTimes = allTimes.filter(time => {
      const [hh, mm] = time.split(':').map(Number);
      const slotDateTime = new Date(this.selectedDate + 'T' + time + ':00');
  
      // Si es un día pasado, descarta completamente
      if (slotDateTime < now) return false;
  
      // Si es hoy, solo mostrar las horas a partir de +1h
      if (selectedDay.toDateString() === now.toDateString()) {
        return slotDateTime.getTime() >= now.getTime() + 60 * 60 * 1000;
      }
  
      return true;
    });
  }

  loadPsychologist() {
    this.userService.getPsychologistById(this.psychologistId).subscribe({
      next: data => this.psychologist = data,
      error: err => console.error('Error cargando psicólogo', err),
    });
  }

  loadWeeklyAvailability() {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 6);

    const startDate = start.toISOString().split('T')[0]; // YYYY-MM-DD
    const endDate = end.toISOString().split('T')[0];

    this.appointmentService.getAvailableTimesForWeek(this.psychologistId, startDate, endDate).subscribe({
      next: data => {
        this.weeklyAvailability = data;

        // Verifica que la fecha seleccionada existe en la disponibilidad
        console.log('Disponibilidad cargada:', data);
        this.onDateChange(); // refresca los horarios disponibles del día actual
      },
      error: err => {
        console.error('Error al cargar disponibilidad semanal', err);
        this.weeklyAvailability = {};
        this.availableTimes = [];
      }
    });
  }

  confirm() {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Por favor, selecciona día y hora.');
      return;
    }
  
    const dateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);
    const nowPlusOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
  
    if (dateTime < nowPlusOneHour) {
      alert('La cita debe ser al menos 1 hora desde ahora.');
      return;
    }
  
    const appointment: AppointmentDTO = {
      dateTime: dateTime.toISOString(),
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