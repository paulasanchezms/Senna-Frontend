import { UserResponseDTO } from './user';

export interface AppointmentDTO {
    dateTime: string; 
    duration: number;
    status?: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
    description: string;
    psychologistId: number;
}

export interface AppointmentResponseDTO {
    id: number;
    dateTime: string; 
    duration: number;
    status: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
    description: string;
    patient: UserResponseDTO;
    psychologist: UserResponseDTO;
}