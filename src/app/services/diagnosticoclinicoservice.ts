import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { DiagnosticoClinicoDTO } from '../models/DiagnosticoClinicoDTO';

@Injectable({
  providedIn: 'root',
})
export class Diagnosticoclinicoservice {
  private apiURL = `${environment.base}/api/diagnosticos`;

  constructor(private http: HttpClient) { }

  insert(d: DiagnosticoClinicoDTO): Observable<DiagnosticoClinicoDTO> {
    return this.http.post<DiagnosticoClinicoDTO>(this.apiURL, d);
  }

  validar(id: number): Observable<DiagnosticoClinicoDTO> {
    return this.http.put<DiagnosticoClinicoDTO>(`${this.apiURL}/${id}/validar`, {});
  }

  listId(id: number): Observable<DiagnosticoClinicoDTO> {
    return this.http.get<DiagnosticoClinicoDTO>(`${this.apiURL}/${id}`);
  }

  historial(usuarioId: number): Observable<DiagnosticoClinicoDTO[]> {
    return this.http.get<DiagnosticoClinicoDTO[]>(`${this.apiURL}/usuario/${usuarioId}`);
  }

  pendientes(): Observable<DiagnosticoClinicoDTO[]> {
    return this.http.get<DiagnosticoClinicoDTO[]>(`${this.apiURL}/pendientes`);
  }

  validadosPorPsicologo(psicologoId: number): Observable<DiagnosticoClinicoDTO[]> {
    return this.http.get<DiagnosticoClinicoDTO[]>(`${this.apiURL}/psicologo/${psicologoId}`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
