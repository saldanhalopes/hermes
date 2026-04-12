import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = '/api/change-control';

  constructor(private http: HttpClient) {}

  analyzeImpact(requestId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/requests/${requestId}/analyze`, {}, { responseType: 'text' });
  }

  suggestOpinion(description: string, area: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/ai-suggest`, { 
      params: { description, area },
      responseType: 'text'
    });
  }
}
