import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { ModalController } from '@ionic/angular';
import { WorkingHourModalPage } from '../working-hour-modal/working-hour-modal.page';
import { UserService } from '../../services/user.service';
import { AppointmentResponseDTO } from '../../models/appointment';
import { WorkingHourService, WorkingHourDTO } from '../../services/working-hour.service';
import { CalendarOptions } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; 

@Component({
  standalone: false,
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
    },
    themeSystem: 'standard',
    height: 'auto',
    contentHeight: 'auto',
    locale: esLocale,
  };

  private userId!: number;
  private allHours: WorkingHourDTO[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private workingHourService: WorkingHourService
  ) {}

  ngOnInit() {
    this.userService.me().subscribe({
      next: user => {
        this.userId = user.id_user;
        this.loadAppointments();
        this.loadWorkingHours();
      },
      error: err => console.error('No se pudo obtener usuario', err)
    });
  }

  loadAppointments() {
    this.appointmentService.getPsychologistAppointments().subscribe((appointments: AppointmentResponseDTO[]) => {
      const events = appointments.map(appt => ({
        title: `Cita con ${appt.patient?.name || 'Paciente'}`,
        start: appt.dateTime,
        end: this.calculateEndTime(appt.dateTime, appt.duration),
        color: '#f87171'
      }));
      this.calendarOptions.events = events;
    });
  }

  loadWorkingHours() {
    this.workingHourService.getWorkingHours(this.userId).subscribe((hours: WorkingHourDTO[]) => {
      this.allHours = hours;
      this.updateCalendarSlotTimes();
    });
  }

  updateCalendarSlotTimes() {
    if (this.allHours.length === 0) {
      this.calendarOptions.slotMinTime = '08:00:00'; // fallback por defecto
      this.calendarOptions.slotMaxTime = '18:00:00';
      return;
    }

    const allStartHours = this.allHours.map(h => parseInt(h.startTime.slice(0,2)));
    const allEndHours = this.allHours.map(h => parseInt(h.endTime.slice(0,2)));
    const min = Math.min(...allStartHours);
    const max = Math.max(...allEndHours);

    this.calendarOptions = {
      ...this.calendarOptions,
      slotMinTime: `${min.toString().padStart(2, '0')}:00:00`,
      slotMaxTime: `${(max + 1).toString().padStart(2, '0')}:00:00` // sumamos 1h para incluir fin
    };
  }

  calculateEndTime(start: string, duration: number) {
    const date = new Date(start);
    date.setMinutes(date.getMinutes() + duration);
    return date.toISOString();
  }

  async handleDateClick(info: DateClickArg) {
    const dayOfWeek = new Date(info.date).getDay();
    const modal = await this.modalCtrl.create({
      component: WorkingHourModalPage,
      componentProps: {
        userId: this.userId,
        dayOfWeek: dayOfWeek,
        allHours: this.allHours
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data === 'saved') {
      this.loadWorkingHours();  // refresca horas visibles en calendario
      this.loadAppointments();  // opcional: refresca citas si necesitas
    }
  }
}