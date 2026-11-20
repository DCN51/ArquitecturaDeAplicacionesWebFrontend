import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Loginservice } from './loginservice';
import { CasoEmergenciaDTO } from '../models/CasoEmergenciaDTO';
import { CasosPorPsicologoDTO } from '../models/CasosPorPsicologoDTO';

@Injectable({
  providedIn: 'root',
})
export class Casoemergenciaservice {
  private apiURL = `${environment.base}/api/casos-emergencia`;

  constructor(private http: HttpClient, private loginService: Loginservice) { }

  list(): Observable<CasoEmergenciaDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<CasoEmergenciaDTO[]>(this.apiURL, { headers });
  }

  insert(c: CasoEmergenciaDTO): Observable<CasoEmergenciaDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<CasoEmergenciaDTO>(this.apiURL, c, { headers });
  }

  listId(id: number): Observable<CasoEmergenciaDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<CasoEmergenciaDTO>(`${this.apiURL}/${id}`, { headers });
  }

  update(c: CasoEmergenciaDTO): Observable<CasoEmergenciaDTO> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<CasoEmergenciaDTO>(this.apiURL, c, { headers });
  }

  delete(id: number): Observable<void> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiURL}/${id}`, { headers });
  }

  listarPendientes(): Observable<CasoEmergenciaDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<CasoEmergenciaDTO[]>(`${this.apiURL}/pendientes`, { headers });
  }

  contarPorPsicologo(): Observable<CasosPorPsicologoDTO[]> {
    const token = this.loginService.sesion()?.token || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<CasosPorPsicologoDTO[]>(`${this.apiURL}/por-psicologo`, { headers });
  }
}
