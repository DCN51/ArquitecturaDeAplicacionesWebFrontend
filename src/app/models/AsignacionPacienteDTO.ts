export class AsignacionPacienteDTO {
  asignacionPacienteId: number = 0;
  pacienteId: number = 0;
  psicologoId: number = 0;
  nombrePaciente: string = '';
  nombrePsicologo: string = '';
  fechaAsignacion: string | null = null;
  activa: boolean = true;
}
