import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UserDTO } from '../models/UserDTO';
import { UserUpdateDTO } from '../models/UserUpdateDTO';

@Injectable({
  providedIn: 'root',
})
export class Usersservice {
  private apiURL = `${environment.base}/api/users`;

  constructor(private http: HttpClient) { }

  // HUF20 - tabla de usuarios | HUF39 - filtros opcionales por rol y estado de cuenta
  getUsuarios(roleId?: number | null, estadoCuenta?: string): Observable<UserDTO[]> {
    let params = new HttpParams();
    if (roleId) {
      params = params.set('roleId', roleId);
    }
    if (estadoCuenta) {
      params = params.set('estadoCuenta', estadoCuenta);
    }
    return this.http.get<UserDTO[]>(this.apiURL, { params });
  }
  // HUF20 - desactivar cuenta
  desactivar(id: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.apiURL}/${id}/deactivate`, {});
  }
  // HUF21 - cargar el usuario a editar
  listId(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiURL}/${id}`);
  }
  // HUF21 - actualizar
  update(id: number, dto: UserUpdateDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiURL}/${id}`, dto);
  }
}