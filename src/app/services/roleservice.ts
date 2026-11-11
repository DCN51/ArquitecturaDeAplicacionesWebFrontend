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

  // HUF18
  getRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.apiURL);
  }
}