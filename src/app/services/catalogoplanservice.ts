import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CatalogoPlanDTO } from '../models/CatalogoPlanDTO';

@Injectable({
  providedIn: 'root',
})
export class Catalogoplanservice {
  private apiURL = `${environment.base}/api/CatalogoPlan`;

  constructor(private http: HttpClient) { }

  // HUF04
  getPlanes(): Observable<CatalogoPlanDTO[]> {
    return this.http.get<CatalogoPlanDTO[]>(this.apiURL);
  }
  // HUF01
  insert(p: CatalogoPlanDTO): Observable<CatalogoPlanDTO> {
    return this.http.post<CatalogoPlanDTO>(this.apiURL, p);
  }
  // HUF02
  update(p: CatalogoPlanDTO): Observable<CatalogoPlanDTO> {
    return this.http.put<CatalogoPlanDTO>(this.apiURL, p);
  }
  // HUF02
  listId(id: number): Observable<CatalogoPlanDTO> {
    return this.http.get<CatalogoPlanDTO>(`${this.apiURL}/${id}`);
  }
  // HUF03
  desactivar(id: number): Observable<CatalogoPlanDTO> {
    return this.http.patch<CatalogoPlanDTO>(`${this.apiURL}/${id}/desactivar`, {});
  }
}