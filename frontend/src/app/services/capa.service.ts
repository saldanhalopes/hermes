import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Capa, CapaAction, CapaStatus } from '../models/capa.model';

@Injectable({
  providedIn: 'root'
})
export class CapaService {
  private apiUrl = '/api/capas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Capa[]> {
    return this.http.get<Capa[]>(this.apiUrl);
  }

  getById(id: number): Observable<Capa> {
    return this.http.get<Capa>(`${this.apiUrl}/${id}`);
  }

  create(capa: Capa): Observable<Capa> {
    return this.http.post<Capa>(this.apiUrl, capa);
  }

  update(id: number, capa: Capa): Observable<Capa> {
    return this.http.put<Capa>(`${this.apiUrl}/${id}`, capa);
  }

  updateStatus(id: number, status: CapaStatus): Observable<CapaStatus> {
    return this.http.patch<CapaStatus>(`${this.apiUrl}/${id}/status`, status);
  }

  addAction(capaId: number, action: CapaAction): Observable<CapaAction> {
    return this.http.post<CapaAction>(`${this.apiUrl}/${capaId}/actions`, action);
  }

  deleteAction(actionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/actions/${actionId}`);
  }

  suggestRCA(description: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/suggest-rca`, description, { responseType: 'text' });
  }
}
