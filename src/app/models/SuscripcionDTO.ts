export class SuscripcionDTO {
  suscripcionId: number = 0;
  fechaInicio: Date | null = null;      // la pone el back
  fechaFin: Date | null = null;         // null en el plan free
  estadoSuscripcion: string = '';       // "activa" o "cancelada" (la pone el back)
  metodoPagoSuscripcion: string | null = null;
  referenciaPagoSuscripcion: string | null = null;
  usuarioId: number = 0;
  catalogoPlanId: number = 0;
}