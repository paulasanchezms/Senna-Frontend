export interface WorkingHour {
  id: number;
    dayOfWeek: number;     // 0 = domingo, 1 = lunes, … (igual que LocalDate.getDayOfWeek()%7)
    startTime: string;     // formato "HH:mm:ss"
    endTime:   string;     // formato "HH:mm:ss"
  }