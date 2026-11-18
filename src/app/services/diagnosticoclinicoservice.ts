import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Loginservice } from './loginservice';
import { DiagnosticoClinicoDTO } from '../models/DiagnosticoClinicoDTO';

@Injectable({
  providedIn: 'root',
})
export class Diagnosticoclinicoservice {
  private apiURL = `${environment.base}/api/diagnosticos`;

  constructor(private http: HttpClient, private loginService: Loginservice) { }

  insert(d: DiagnosticoClinicoDTO): Observable<DiagnosticoClinicoDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<DiagnosticoClinicoDTO>(this.apiURL, d, { headers });
  }

  validar(id: number): Observable<DiagnosticoClinicoDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<DiagnosticoClinicoDTO>(`${this.apiURL}/${id}/validar`, {}, { headers });
  }

  listId(id: number): Observable<DiagnosticoClinicoDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<DiagnosticoClinicoDTO>(`${this.apiURL}/${id}`, { headers });
  }

  historial(usuarioId: number): Observable<DiagnosticoClinicoDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<DiagnosticoClinicoDTO[]>(`${this.apiURL}/usuario/${usuarioId}`, { headers });
  }

  pendientes(): Observable<DiagnosticoClinicoDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<DiagnosticoClinicoDTO[]>(`${this.apiURL}/pendientes`, { headers });
  }

  validadosPorPsicologo(psicologoId: number): Observable<DiagnosticoClinicoDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<DiagnosticoClinicoDTO[]>(`${this.apiURL}/psicologo/${psicologoId}`, { headers });
  }

  eliminar(id: number): Observable<void> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiURL}/${id}`, { headers });
  }
}
