import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  suscriptoresPorPlan(): Observable<SuscriptoresPorPlanDTO[]> {
    return this.http.get<SuscriptoresPorPlanDTO[]>(`${this.apiURL}/suscriptores-por-plan`);
  }
}