import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SuscripcionDTO } from '../models/SuscripcionDTO';
import { SuscriptoresPorPlanDTO } from '../models/SuscriptoresPorPlanDTO';

@Injectable({
  providedIn: 'root',
})
export class Suscripcionservice {
  private apiURL = `${environment.base}/api/suscripciones`;

  constructor(private http: HttpClient) { }

  // HUF05 - Contratar plan
  insert(s: SuscripcionDTO): Observable<SuscripcionDTO> {
    return this.http.post<SuscripcionDTO>(this.apiURL, s);
  }
  // HUF06 - Cambiar plan
  cambiarPlan(s: SuscripcionDTO): Observable<SuscripcionDTO> {
    return this.http.put<SuscripcionDTO>(`${this.apiURL}/cambiar-plan`, s);
  }
  // HUF07 - Cancelar suscripción
  cancelar(usuarioId: number): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/usuario/${usuarioId}/cancelar`, {});
  }
  // HUF08 - Historial
  historial(usuarioId: number): Observable<SuscripcionDTO[]> {
    return this.http.get<SuscripcionDTO[]>(`${this.apiURL}/usuario/${usuarioId}`);
  }
    // HUF09 - Suscripciones por vencer
  porVencer(dias: number): Observable<SuscripcionDTO[]> {
    return this.http.get<SuscripcionDTO[]>(`${this.apiURL}/por-vencer`, {
      params: { dias: dias }
    });
  }
  // HUF10 - Suscriptores activos por plan
  // true si el paciente tiene una suscripción activa de pago
  // (el plan free es el único que no tiene fecha de fin)
  tienePlanPagado(usuarioId: number): Observable<boolean> {
    return this.historial(usuarioId).pipe(
      map(lista => lista.some(s => s.estadoSuscripcion === 'activa' && s.fechaFin !== null))
    );
  }

  suscriptoresPorPlan(): Observable<SuscriptoresPorPlanDTO[]> {
    return this.http.get<SuscriptoresPorPlanDTO[]>(`${this.apiURL}/suscriptores-por-plan`);
  }
}