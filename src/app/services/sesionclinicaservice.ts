import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Loginservice } from './loginservice';
import { SesionClinicaDTO } from '../models/SesionClinicaDTO';

@Injectable({
  providedIn: 'root',
})
export class Sesionclinicaservice {
  private apiURL = `${environment.base}/api/sesiones`;

  constructor(private http: HttpClient, private loginService: Loginservice) { }

  iniciar(s: SesionClinicaDTO): Observable<SesionClinicaDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<SesionClinicaDTO>(this.apiURL, s, { headers });
  }

  finalizar(id: number, s: SesionClinicaDTO): Observable<SesionClinicaDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<SesionClinicaDTO>(`${this.apiURL}/${id}/finalizar`, s, { headers });
  }

  listId(id: number): Observable<SesionClinicaDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<SesionClinicaDTO>(`${this.apiURL}/${id}`, { headers });
  }

  historial(usuarioId: number): Observable<SesionClinicaDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<SesionClinicaDTO[]>(`${this.apiURL}/usuario/${usuarioId}`, { headers });
  }

  derivaciones(): Observable<SesionClinicaDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<SesionClinicaDTO[]>(`${this.apiURL}/derivaciones`, { headers });
  }

  eliminar(id: number): Observable<void> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiURL}/${id}`, { headers });
  }
}
