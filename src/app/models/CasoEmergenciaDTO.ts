export class CasoEmergenciaDTO {
  casoEmergenciaId: number = 0;
  usuarioId: number = 0;
  psicologoId: number | null = null;
  sesionClinicaId: number = 0;
  fechaEmergencia: string | null = null;
  nivelUrgencia: string = 'bajo';
  estado: string = 'pendiente';
  resumenContextual: string | null = null;
  notasPsicologo: string | null = null;
  fechaCierre: string | null = null;
}
