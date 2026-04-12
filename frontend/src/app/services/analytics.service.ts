import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsData {
  totalChanges: number;
  pendingChanges: number;
  approvedChanges: number;
  totalUsers: number;
  typeDistribution: { [key: string]: number };
  monthlyTrend: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = '/api/analytics';

  constructor(private http: HttpClient) { }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(this.apiUrl);
  }
}
