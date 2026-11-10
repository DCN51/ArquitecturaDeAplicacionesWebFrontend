export class CatalogoPlanDTO {
  catalogoPlanId: number = 0;
  nombreCatalogoPlan: string = '';
  precioMensualCatalogoPlan: number = 0;
  limiteSesionesMes: number = 0;
  incluyeDiagnostico: boolean = false;
  incluyeActividades: boolean = false;
  permiteDerivacion: boolean = false;
  descripcionCatalogoPlan: string = '';
  activoCatalogoPlan: boolean = true;
}