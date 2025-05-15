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
export class CalendarPage {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, interactionPlugin],
    events: [],
    locale: esLocale,
    themeSystem: 'standard',
    height: 'auto',
    contentHeight: 'auto',
  
    allDaySlot: false, 
    
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
  
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
  
    slotLabelClassNames: ['custom-slot-label'],
  
    dayHeaderDidMount: (info) => {
      info.el.style.color = '#f17c63';
      info.el.style.fontFamily = 'Poppins';
      info.el.style.fontWeight = '600';
      info.el.style.fontSize = '13px';
    }
  };
  private userId!: number;
  public allHours: WorkingHourDTO[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private workingHourService: WorkingHourService
  ) {}

 

  loadAppointments() {
    this.appointmentService.getPsychologistAppointments().subscribe((appointments: AppointmentResponseDTO[]) => {
      const colors = ['#f17c63', '#c4a2e2', '#c7e2c3', '#ee9870', '#f4b098'];
      let colorIndex = 0;
  
      const events = appointments
        .filter(appt => appt.status === 'CONFIRMADA')
        .map(appt => {
          const name = appt.patient?.name || '';
          const lastName = appt.patient?.last_name || '';
          const fullName = `${name} ${lastName}`.trim();
  
          return {
            title: fullName || 'Paciente',
            start: appt.dateTime,
            end: this.calculateEndTime(appt.dateTime, appt.duration),
            color: colors[colorIndex++ % colors.length]
          };
        });
  
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
      this.calendarOptions.slotMinTime = '08:00:00';
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
      slotMaxTime: `${(max + 1).toString().padStart(2, '0')}:00:00`
    };
  }

  calculateEndTime(start: string, duration: number) {
    const date = new Date(start);
    date.setMinutes(date.getMinutes() + duration);
    return date.toISOString();
  }

  async handleDateClick(info: DateClickArg) {
    const date = new Date(info.date);
    const jsDay = date.getDay();
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

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
    if (data?.status === 'saved') {
      this.allHours = data.updatedHours;
      this.loadWorkingHours();
      this.loadAppointments();
    }
  }

  ionViewWillEnter() {
    this.userService.me().subscribe({
      next: user => {
        this.userId = user.id_user;
        this.loadAppointments();
        this.loadWorkingHours();
      },
      error: err => console.error('No se pudo obtener usuario', err)
    });}

    ngAfterViewInit() {
      const applyFullCalendarStyles = () => {
        // 🔸 Horas laterales (ej: 08:00, 09:00...)
        const slotLabels = document.querySelectorAll('.fc-timegrid-slot-label-cushion');
        slotLabels.forEach((el: any) => {
          el.style.color = '#f17c63'; // salmon
          el.style.fontFamily = 'Poppins';
          el.style.fontSize = '13px';
          el.style.fontWeight = '600';
        });
    
        // 🔸 Título del calendario
        const calendarTitle = document.querySelector('.fc-toolbar-title');
        if (calendarTitle) {
          (calendarTitle as HTMLElement).style.color = '#f17c63';
          (calendarTitle as HTMLElement).style.fontFamily = 'Poppins';
          (calendarTitle as HTMLElement).style.fontWeight = '700';
          (calendarTitle as HTMLElement).style.fontSize = '20px';
        }
      };
    
      // Aplica estilos después del render inicial
      setTimeout(() => applyFullCalendarStyles(), 300);
    
      // Observa el DOM del calendario para reaplicar estilos si cambian
      const calendarEl = document.querySelector('.fc-timegrid');
      if (calendarEl) {
        const observer = new MutationObserver(() => applyFullCalendarStyles());
        observer.observe(calendarEl, {
          childList: true,
          subtree: true
        });
      }
    }
}