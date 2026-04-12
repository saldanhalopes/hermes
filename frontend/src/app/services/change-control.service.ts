import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangeRequest } from '../models/change-request.model';

@Injectable({
  providedIn: 'root'
})
export class ChangeControlService {
  private apiUrl = '/api/change-control';

  constructor(private http: HttpClient) { }

  getRequests(): Observable<ChangeRequest[]> {
    return this.http.get<ChangeRequest[]>(`${this.apiUrl}/requests`);
  }

  getRequest(id: number): Observable<ChangeRequest> {
    return this.http.get<ChangeRequest>(`${this.apiUrl}/requests/${id}`);
  }

  createRequest(request: ChangeRequest): Observable<ChangeRequest> {
    return this.http.post<ChangeRequest>(`${this.apiUrl}/requests`, request);
  }

  updateRequest(id: number, request: ChangeRequest): Observable<ChangeRequest> {
    return this.http.put<ChangeRequest>(`${this.apiUrl}/requests/${id}`, request);
  }

  submitImpact(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/requests/${id}/submit-impact`, {});
  }

  submitCommittee(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/requests/${id}/submit-committee`, {});
  }

  approveExecution(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/requests/${id}/approve-execution`, {});
  }

  approveWithSignature(id: number, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/requests/${id}/approve-with-signature`, { password });
  }

  getHistory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/requests/${id}/history`);
  }

  suggestAI(description: string, area: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/ai-suggest`, {
        params: { description, area },
        responseType: 'text'
    });
  }
}
