import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ActividadDTO } from '../models/ActividadDTO';

@Injectable({
  providedIn: 'root',
})
export class Actividadservice {
  private apiURL = `${environment.base}/api/activities`;

  constructor(private http: HttpClient) { }

  // HUF22
  insert(a: ActividadDTO): Observable<ActividadDTO> {
    return this.http.post<ActividadDTO>(this.apiURL, a);
  }
  // Tabla: actividades de un paciente
  getActividades(userId: number): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(`${this.apiURL}/users/${userId}`);
  }
  // HUF23
  update(id: number, a: ActividadDTO): Observable<ActividadDTO> {
    return this.http.put<ActividadDTO>(`${this.apiURL}/${id}`, a);
  }
  // HUF24
  completar(id: number, feedback: string | null): Observable<ActividadDTO> {
    return this.http.put<ActividadDTO>(`${this.apiURL}/${id}/complete`, { feedback: feedback });
  }
  // HUF25
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}