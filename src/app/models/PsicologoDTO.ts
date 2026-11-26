export class PsicologoDTO {
  psicologoId: number = 0;
  username: string = '';
  nombres: string = '';
  apellidos: string = '';
  correoElectronico: string = '';
  numeroColegiatura: string | null = null;
  especializacion: string | null = null;
  anosExperiencia: number | null = null;
  estadoVerificacion: string = '';
  estadoCuenta: string = '';
  maxPacientes: number | null = null;
  pacientesAsignados: number = 0;
}
