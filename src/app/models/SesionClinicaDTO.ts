export class SesionClinicaDTO {
  sesionClinicaId: number = 0;
  usuarioId: number = 0;
  fechaHoraInicio: string | null = null;
  fechaHoraFin: string | null = null;
  emocionDetectada: string | null = null;
  nivelUrgencia: string = 'bajo';
  resumenIa: string | null = null;
  requiereDerivacion: boolean = false;
  estado: string = '';
}
