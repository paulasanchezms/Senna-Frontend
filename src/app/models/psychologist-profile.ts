import { WorkingHourDTO } from "../services/working-hour.service";

export interface PsychologistProfile {
    consultationDuration: number;    // en minutos
    consultationPrice: number;       
    specialty: string;
    location: string;
    document: string;
    workingHours: WorkingHourDTO[];  }