import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PsicologoDTO } from '../models/PsicologoDTO';
import { CapacidadPsicologoDTO } from '../models/CapacidadPsicologoDTO';

@Injectable({
  providedIn: 'root',
})
export class Psicologoservice {
  private apiURL = `${environment.base}/api/psicologos`;

  constructor(private http: HttpClient) { }

  getPsicologos(): Observable<PsicologoDTO[]> {
    return this.http.get<PsicologoDTO[]>(this.apiURL);
  }
  verificar(id: number): Observable<PsicologoDTO> {
    return this.http.patch<PsicologoDTO>(`${this.apiURL}/${id}/verificar`, {});
  }
  cambiarCapacidad(id: number, dto: CapacidadPsicologoDTO): Observable<PsicologoDTO> {
    return this.http.put<PsicologoDTO>(`${this.apiURL}/${id}/capacidad`, dto);
  }
}
