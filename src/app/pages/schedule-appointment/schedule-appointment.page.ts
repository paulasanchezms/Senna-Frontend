import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDTO } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  standalone:false,
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.page.html',
})
export class ScheduleAppointmentPage implements OnInit {
  psychologistId!: number;
  selectedDate!: string;
  selectedTime!: string; 
  duration: number = 60;
  description: string = '';
  psychologist: any;  // O usa tu UserResponseDTO si lo tienes importado
  availableTimes: string[] = [] 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.psychologistId = +this.route.snapshot.paramMap.get('id')!;
  }

  confirm() {
    const appointment: AppointmentDTO = {
      dateTime: `${this.selectedDate}T${this.selectedTime}`,
      duration: this.duration,
      description: this.description,
      psychologistId: this.psychologistId,
      status: 'PENDIENTE'
    };
    this.router.navigate(['/confirm-appointment'], { state: { appointment } });
  }
}