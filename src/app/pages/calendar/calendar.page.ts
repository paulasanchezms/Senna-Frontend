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
import { WorkingHourCustomService } from 'src/app/services/working-hour-custom.service';
import { WorkingHourCustomDTO } from 'src/app/models/working-hour-custom';

@Component({
  standalone:false,
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
    dateClick: this.handleDateClick.bind(this),
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
      info.el.style.setProperty('color', '#f17c63', 'important');
      info.el.style.setProperty('font-family', 'Poppins', 'important');
      info.el.style.setProperty('font-weight', '600', 'important');
      info.el.style.setProperty('font-size', '13px', 'important');
    }
  };

  private userId!: number;
  public allHours: WorkingHourDTO[] = [];

  isCustomDate = false;
  isDayEnabled = true;
  workingHoursForDay: WorkingHourCustomDTO[] = [];
  selectedDay = 0;


  constructor(
    private appointmentService: AppointmentService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private workingHourService: WorkingHourService,
    private customWhService: WorkingHourCustomService

  ) {}

  ionViewWillEnter() {
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
      this.highlightWorkingDays();
      this.updateCalendarSlotTimes();
    });
  }

  updateCalendarSlotTimes() {
    if (this.allHours.length === 0) {
      this.calendarOptions.slotMinTime = '08:00:00';
      this.calendarOptions.slotMaxTime = '18:00:00';
      return;
    }

    const allStartHours = this.allHours.map(h => parseInt(h.startTime.slice(0, 2)));
    const allEndHours = this.allHours.map(h => parseInt(h.endTime.slice(0, 2)));
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
    console.log('Fecha clicada:', info.date); 
    const date = new Date(info.date);
    const jsDay = date.getDay();
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    const modal = await this.modalCtrl.create({
      component: WorkingHourModalPage,
      componentProps: {
        userId: this.userId,
        dayOfWeek: dayOfWeek,
        selectedDate: date.toISOString().split('T')[0],
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

  ngAfterViewInit() {
    const applyFullCalendarStyles = () => {
      // 🔸 Estilos para las horas laterales
      const slotLabels = document.querySelectorAll('.fc-timegrid-slot-label-cushion');
      slotLabels.forEach(el => {
        const element = el as HTMLElement;
        element.style.setProperty('color', '#f17c63', 'important');
        element.style.setProperty('font-family', 'Poppins', 'important');
        element.style.setProperty('font-size', '13px', 'important');
        element.style.setProperty('font-weight', '600', 'important');
      });
    
      // 🔸 Estilo para el título
      const calendarTitle = document.querySelector('.fc-toolbar-title');
      if (calendarTitle) {
        const titleEl = calendarTitle as HTMLElement;
        titleEl.style.setProperty('color', '#f17c63', 'important');
        titleEl.style.setProperty('font-family', 'Poppins', 'important');
        titleEl.style.setProperty('font-weight', '700', 'important');
        titleEl.style.setProperty('font-size', '20px', 'important');
      }
    };

    // Aplicar estilos tras renderizado inicial
    setTimeout(() => applyFullCalendarStyles(), 300);

    // Observador para aplicar estilos tras cambios del calendario
    const calendarEl = document.querySelector('.fc-timegrid');
    if (calendarEl) {
      const observer = new MutationObserver(() => {
        applyFullCalendarStyles();
      });
      observer.observe(calendarEl, {
        childList: true,
        subtree: true
      });
    }
  }

  highlightWorkingDays() {
    const defaultWorkingDays = new Set(this.allHours.map(h => h.dayOfWeek));
  
    const daysInCurrentWeek = this.getCurrentWeekDates();
    const backgroundEvents = daysInCurrentWeek.map(({ date, dayOfWeek }) => {
      const isWorking = defaultWorkingDays.has(dayOfWeek);
      return {
        start: date,
        display: 'background',
        backgroundColor: isWorking ? '#d4f5e9' : '#fcd5d5',
        end: date,
        allDay: true
      };
    });
  
    const existingEvents = Array.isArray(this.calendarOptions.events)
    ? this.calendarOptions.events
    : [];

  this.calendarOptions = {
    ...this.calendarOptions,
    events: [...existingEvents, ...backgroundEvents]
  };
  }
  
  getCurrentWeekDates(): { date: string; dayOfWeek: number }[] {
    const today = new Date();
    const start = today.getDate() - today.getDay();
    const dates: { date: string; dayOfWeek: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(start + i + 1);
      dates.push({
        date: d.toISOString().split('T')[0],
        dayOfWeek: i
      });
    }
    return dates;
  }
  
  // 2. WorkingHourModalPage.ts - forzar toggle activo si hay horario por defecto y bloquear si no puede trabajar
  loadHoursForDate(date: string) {
    this.customWhService.getCustomHours(this.userId, date).subscribe(customHours => {
      const fallback = this.allHours.filter(h => h.dayOfWeek === this.selectedDay);
      if (customHours.length > 0) {
        this.isCustomDate = true;
        this.isDayEnabled = true;
        this.workingHoursForDay = customHours.map(h => ({
          startTime: h.startTime.slice(0, 5),
          endTime: h.endTime.slice(0, 5),
        }));
      } else {
        this.isCustomDate = false;
        this.isDayEnabled = fallback.length > 0;
        this.workingHoursForDay = fallback.map(h => ({
          startTime: h.startTime.slice(0, 5),
          endTime: h.endTime.slice(0, 5),
        }));
      }
    });
  }
  

}