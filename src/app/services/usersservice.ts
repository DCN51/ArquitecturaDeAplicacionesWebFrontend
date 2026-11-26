import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getUsuarios(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiURL);
  }
  desactivar(id: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.apiURL}/${id}/deactivate`, {});
  }
  listId(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiURL}/${id}`);
  }
  getPerfil(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiURL}/me`);
  }
  updatePerfil(dto: UserUpdateDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiURL}/me`, dto);
  }
  update(id: number, dto: UserUpdateDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiURL}/${id}`, dto);
  }
}