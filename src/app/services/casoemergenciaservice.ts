import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CasoEmergenciaDTO } from '../models/CasoEmergenciaDTO';
import { CasosPorPsicologoDTO } from '../models/CasosPorPsicologoDTO';

@Injectable({
  providedIn: 'root',
})
export class Casoemergenciaservice {
  private apiURL = `${environment.base}/api/casos-emergencia`;

  constructor(private http: HttpClient) { }

  list(): Observable<CasoEmergenciaDTO[]> {
    return this.http.get<CasoEmergenciaDTO[]>(this.apiURL);
  }

  insert(c: CasoEmergenciaDTO): Observable<CasoEmergenciaDTO> {
    return this.http.post<CasoEmergenciaDTO>(this.apiURL, c);
  }

  listId(id: number): Observable<CasoEmergenciaDTO> {
    return this.http.get<CasoEmergenciaDTO>(`${this.apiURL}/${id}`);
  }

  update(c: CasoEmergenciaDTO): Observable<CasoEmergenciaDTO> {
    return this.http.put<CasoEmergenciaDTO>(this.apiURL, c);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  listarPendientes(): Observable<CasoEmergenciaDTO[]> {
    return this.http.get<CasoEmergenciaDTO[]>(`${this.apiURL}/pendientes`);
  }

  contarPorPsicologo(): Observable<CasosPorPsicologoDTO[]> {
    return this.http.get<CasosPorPsicologoDTO[]>(`${this.apiURL}/por-psicologo`);
  }
}