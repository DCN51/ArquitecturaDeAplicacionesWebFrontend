export class DiagnosticoClinicoDTO {
  diagnosticoClinicoId: number = 0;
  usuarioId: number = 0;
  sesionClinicaId: number = 0;
  fechaDiagnostico: Date | null = null;
  resultadoPrincipal: string = '';
  descripcionDetallada: string | null = null;
  nivelRiesgo: string = '';
  recomendacionGeneral: string | null = null;
  validacionPsicologoId: number | null = null;
  fechaValidacion: Date | null = null;
}
