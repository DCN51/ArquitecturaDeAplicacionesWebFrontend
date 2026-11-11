export class ActividadDTO {
  recommendedActivityId: number = 0;
  userId: number = 0;               // paciente
  diagnosisId: number = 0;          // diagnóstico (debe ser del mismo paciente)
  title: string = '';
  description: string = '';
  type: string = '';
  assignedDate: string | null = null;   // la pone el back si no se envía
  completedDate: string | null = null;
  status: string = '';                  // "PENDIENTE" o "COMPLETADA"
  feedback: string | null = null;
}