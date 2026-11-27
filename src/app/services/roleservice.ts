import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RoleDTO } from '../models/RoleDTO';

@Injectable({
  providedIn: 'root',
})
export class Roleservice {
  private apiURL = `${environment.base}/api/roles`;

  constructor(private http: HttpClient) { }

  // HUF18 - listar roles (también lo usa Registro)
  getRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.apiURL);
  }

  // HUF43 - registrar rol
  insert(role: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.apiURL, role);
  }

  // HUF44 - buscar rol por id (para editar)
  listId(id: number): Observable<RoleDTO> {
    return this.http.get<RoleDTO>(`${this.apiURL}/${id}`);
  }

  // HUF44 - actualizar rol
  update(role: RoleDTO): Observable<RoleDTO> {
    return this.http.put<RoleDTO>(this.apiURL, role);
  }

  // HUF45 - eliminar rol
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
