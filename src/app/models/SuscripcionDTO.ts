export class SuscripcionDTO {
  suscripcionId: number = 0;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  estadoSuscripcion: string = '';
  metodoPagoSuscripcion: string | null = null;
  referenciaPagoSuscripcion: string | null = null;
  usuarioId: number = 0;
  catalogoPlanId: number = 0;
  nombrePaciente: string = '';
  nombrePlan: string = '';
}