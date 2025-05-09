import { UserResponseDTO } from './user';

export interface AppointmentDTO {
    dateTime: string;  // o Date, según lo que manejes en el frontend
    duration: number;
    status?: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
    description: string;
    psychologistId: number;
}

export interface AppointmentResponseDTO {
    id: number;
    dateTime: string;  // o Date
    duration: number;
    status: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
    description: string;
    patient: UserResponseDTO;
    psychologist: UserResponseDTO;
}