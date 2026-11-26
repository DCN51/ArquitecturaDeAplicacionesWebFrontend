import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AsignacionPacienteDTO } from '../models/AsignacionPacienteDTO';
import { PacientesPorPsicologoDTO } from '../models/PacientesPorPsicologoDTO';

@Injectable({
  providedIn: 'root',
})
export class Asignacionpacienteservice {
  private apiURL = `${environment.base}/api/asignaciones`;

  constructor(private http: HttpClient) { }

  getAsignaciones(): Observable<AsignacionPacienteDTO[]> {
    return this.http.get<AsignacionPacienteDTO[]>(this.apiURL);
  }
  insert(pacienteId: number, psicologoId: number): Observable<AsignacionPacienteDTO> {
    return this.http.post<AsignacionPacienteDTO>(this.apiURL, { pacienteId, psicologoId });
  }
  pacientesPorPsicologo(): Observable<PacientesPorPsicologoDTO[]> {
    return this.http.get<PacientesPorPsicologoDTO[]>(`${this.apiURL}/pacientes-por-psicologo`);
  }
}
