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

  insert(a: ActividadDTO): Observable<ActividadDTO> {
    return this.http.post<ActividadDTO>(this.apiURL, a);
  }
  getActividades(userId: number): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(`${this.apiURL}/users/${userId}`);
  }
  misActividades(): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(`${this.apiURL}/mis-actividades`);
  }
  update(id: number, a: ActividadDTO): Observable<ActividadDTO> {
    return this.http.put<ActividadDTO>(`${this.apiURL}/${id}`, a);
  }
  completar(id: number, feedback: string | null): Observable<ActividadDTO> {
    return this.http.put<ActividadDTO>(`${this.apiURL}/${id}/complete`, { feedback: feedback });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}