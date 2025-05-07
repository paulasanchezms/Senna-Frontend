import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { ModalController } from '@ionic/angular';
import { WorkingHourModalPage } from '../working-hour-modal/working-hour-modal.page';
import { UserService } from '../../services/user.service';
import { UserResponseDTO } from '../../models/user';
import { AppointmentResponseDTO } from '../../models/appointment';
import { CalendarOptions } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction'; 
import timeGridPlugin from '@fullcalendar/timegrid';        // ✅ importar aquí
import interactionPlugin from '@fullcalendar/interaction';  // ✅ importar aquí

@Component({
  standalone:false,
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, interactionPlugin], 
    events: [],
    dateClick: this.handleDateClick.bind(this),

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    }
  };
  private userId!: number;

  constructor(
    private appointmentService: AppointmentService,
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.appointmentService.getPsychologistAppointments().subscribe((appointments: AppointmentResponseDTO[]) => {
      const events = appointments.map(appt => ({
        title: `Cita`,
        start: appt.dateTime,
        end: this.calculateEndTime(appt.dateTime, appt.duration),
        color: '#f87171'
      }));
      this.calendarOptions.events = events; 
    });

    this.userService.me().subscribe({
      next: user => {
        this.userId = user.id_user;
      },
      error: err => {
        console.error('No se pudo obtener usuario', err);
      }
    });
  }


  loadAppointments() {
    this.appointmentService.getPsychologistAppointments().subscribe((appointments: AppointmentResponseDTO[]) => {
      const events = appointments.map(appt => ({
        title: `Cita con ${appt.patient.name || 'Paciente'}`,
        start: appt.dateTime,
        end: this.calculateEndTime(appt.dateTime, appt.duration),
        color: '#f87171'
      }));

      
    });
  }

  calculateEndTime(start: string, duration: number) {
    const date = new Date(start);
    date.setMinutes(date.getMinutes() + duration);
    return date.toISOString();
  }

  async openWorkingHourModal(info: any) {
    const date = info.date;
    const dayOfWeek = date.getDay();

    const modal = await this.modalCtrl.create({
      component: WorkingHourModalPage,
      componentProps: {
        dayOfWeek: dayOfWeek,
        userId: this.userId
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data === 'saved' || data === 'deleted') {
      console.log('Horario modificado');
    }
  }

  async handleDateClick(info: DateClickArg) {
    console.log('Se ha pulsado en', info.dateStr);
  
    const dayOfWeek = new Date(info.date).getDay(); // 0=Domingo, 1=Lunes...
    console.log('Día de la semana:', dayOfWeek);
  
    const modal = await this.modalCtrl.create({
      component: WorkingHourModalPage,
      componentProps: {
        userId: this.userId, // asegura tener userId cargado antes
        dayOfWeek: dayOfWeek
      }
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data === 'saved') {
      // Opcional: recargar citas o feedback
      console.log('Horario modificado para el día', dayOfWeek);
    }
}
}