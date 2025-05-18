import { PsychologistProfile } from "./psychologist-profile";

export interface UserResponseDTO {
    id_user: number;
    name: string;
    last_name: string;
    email: string;
    role: 'PATIENT' | 'PSYCHOLOGIST' | 'ADMIN'; 
    phone?: string;
    photoUrl?: string;
    profile?: PsychologistProfile;

    // Solo si es psicólogo
    dni?: string;
    qualification?: string;
    specialty?: string;
    location?: string;
    document?: string;
    profileImageUrl?: string;  
}