export class ActividadDTO {
  recommendedActivityId: number = 0;
  userId: number = 0;
  diagnosisId: number = 0;
  title: string = '';
  description: string = '';
  type: string = '';
  assignedDate: string | null = null;
  completedDate: string | null = null;
  status: string = '';
  feedback: string | null = null;
  nombrePaciente: string = '';
}