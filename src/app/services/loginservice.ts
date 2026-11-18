import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginRequestDTO } from '../models/LoginRequestDTO';
import { LoginResponseDTO } from '../models/LoginResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class Loginservice {
  private apiURL = environment.base;

  constructor(private http: HttpClient) { }

  login(datos: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiURL}/login`, datos);
  }

  guardarSesion(sesion: LoginResponseDTO): void {
    sessionStorage.setItem('mindhealth.sesion', JSON.stringify(sesion));
  }

  sesion(): LoginResponseDTO | null {
    if (typeof sessionStorage === 'undefined') return null;
    const datos = sessionStorage.getItem('mindhealth.sesion');
    if (!datos) return null;
    try {
      return JSON.parse(datos);
    } catch {
      return null;
    }
  }

  tieneRol(roles: string[]): boolean {
    const rol = this.sesion()?.rol.toUpperCase().replace('ROLE_', '');
    return roles.includes(rol || '');
  }

  logout(): void {
    sessionStorage.removeItem('mindhealth.sesion');
  }
}
