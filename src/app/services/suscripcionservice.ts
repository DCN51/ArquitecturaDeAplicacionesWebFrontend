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

  insert(s: SuscripcionDTO): Observable<SuscripcionDTO> {
    return this.http.post<SuscripcionDTO>(this.apiURL, s);
  }
  cambiarPlan(s: SuscripcionDTO): Observable<SuscripcionDTO> {
    return this.http.put<SuscripcionDTO>(`${this.apiURL}/cambiar-plan`, s);
  }
  cancelar(usuarioId: number): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/usuario/${usuarioId}/cancelar`, {});
  }
  historial(usuarioId: number): Observable<SuscripcionDTO[]> {
    return this.http.get<SuscripcionDTO[]>(`${this.apiURL}/usuario/${usuarioId}`);
  }
  porVencer(dias: number): Observable<SuscripcionDTO[]> {
    return this.http.get<SuscripcionDTO[]>(`${this.apiURL}/por-vencer`, {
      params: { dias: dias }
    });
  }
  suscriptoresPorPlan(): Observable<SuscriptoresPorPlanDTO[]> {
    return this.http.get<SuscriptoresPorPlanDTO[]>(`${this.apiURL}/suscriptores-por-plan`);
  }
}