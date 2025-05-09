export interface UserResponseDTO {
    id_user: number;
    name: string;
    last_name: string;
    email: string;
    role: 'PATIENT' | 'PSYCHOLOGIST' | 'ADMIN';  // asegura los posibles valores

    // Solo si es psicólogo
    dni?: string;
    qualification?: string;
    specialty?: string;
    location?: string;
    document?: string;
    profileImageUrl?: string;  // solo para frontend, si tienes foto
}