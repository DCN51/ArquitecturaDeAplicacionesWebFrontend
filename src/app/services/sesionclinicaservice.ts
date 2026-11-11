import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SesionClinicaDTO } from '../models/SesionClinicaDTO';

@Injectable({
  providedIn: 'root',
})
export class Sesionclinicaservice {
  private apiURL = `${environment.base}/api/sesiones`;

  constructor(private http: HttpClient) { }

  iniciar(s: SesionClinicaDTO): Observable<SesionClinicaDTO> {
    return this.http.post<SesionClinicaDTO>(this.apiURL, s);
  }

  finalizar(id: number, s: SesionClinicaDTO): Observable<SesionClinicaDTO> {
    return this.http.put<SesionClinicaDTO>(`${this.apiURL}/${id}/finalizar`, s);
  }

  listId(id: number): Observable<SesionClinicaDTO> {
    return this.http.get<SesionClinicaDTO>(`${this.apiURL}/${id}`);
  }

  historial(usuarioId: number): Observable<SesionClinicaDTO[]> {
    return this.http.get<SesionClinicaDTO[]>(`${this.apiURL}/usuario/${usuarioId}`);
  }

  derivaciones(): Observable<SesionClinicaDTO[]> {
    return this.http.get<SesionClinicaDTO[]>(`${this.apiURL}/derivaciones`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
