import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegulatorySubmission, SubmissionStatus } from '../models/regulatory.model';

@Injectable({
  providedIn: 'root'
})
export class RegulatoryService {
  private apiUrl = '/api/regulatory'; // Proxiado pelo proxy.conf.json

  constructor(private http: HttpClient) {}

  getAll(): Observable<RegulatorySubmission[]> {
    return this.http.get<RegulatorySubmission[]>(this.apiUrl);
  }

  getById(id: number): Observable<RegulatorySubmission> {
    return this.http.get<RegulatorySubmission>(`${this.apiUrl}/${id}`);
  }

  getByChangeRequestId(changeId: number): Observable<RegulatorySubmission[]> {
    return this.http.get<RegulatorySubmission[]>(`${this.apiUrl}/by-change/${changeId}`);
  }

  create(submission: RegulatorySubmission, changeRequestIds?: number[]): Observable<RegulatorySubmission> {
    let params = {};
    if (changeRequestIds && changeRequestIds.length > 0) {
      params = { changeRequestIds: changeRequestIds.join(',') };
    }
    return this.http.post<RegulatorySubmission>(this.apiUrl, submission, { params });
  }

  updateStatus(id: number, status: SubmissionStatus): Observable<RegulatorySubmission> {
    return this.http.patch<RegulatorySubmission>(`${this.apiUrl}/${id}/status`, { status });
  }

  linkChanges(id: number, changeIds: number[]): Observable<RegulatorySubmission> {
    return this.http.post<RegulatorySubmission>(`${this.apiUrl}/${id}/links`, changeIds);
  }
}
