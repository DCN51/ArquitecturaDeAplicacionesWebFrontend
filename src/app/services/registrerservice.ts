import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RegistroRequestDTO } from '../models/RegistroRequestDTO';
import { UserDTO } from '../models/UserDTO';

@Injectable({
  providedIn: 'root',
})
export class Registrerservice {
  private apiURL = `${environment.base}/api/usuarios`;

  constructor(private http: HttpClient) { }

  registrar(datos: RegistroRequestDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiURL, datos);
  }
}
