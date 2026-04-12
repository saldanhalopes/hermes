import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { RegulatoryService } from '../../../services/regulatory.service';
import { RegulatorySubmission, SubmissionStatus, Market } from '../../../models/regulatory.model';

@Component({
  selector: 'app-regulatory-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ChartModule, TimelineModule, ButtonModule],
  templateUrl: './regulatory-dashboard.html',
  styleUrls: ['./regulatory-dashboard.css']
})
export class RegulatoryDashboardComponent implements OnInit {
  submissions: RegulatorySubmission[] = [];
  marketChartData: any;
  statusChartData: any;
  chartOptions: any;

  pendingCount = 0;
  approvedCount = 0;
  queryCount = 0;

  constructor(private regulatoryService: RegulatoryService) {}

  ngOnInit() {
    this.regulatoryService.getAll().subscribe((data: RegulatorySubmission[]) => {
      this.submissions = data;
      this.calculateKPIs();
      this.initCharts();
    });

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
  }

  calculateKPIs() {
    this.pendingCount = this.submissions.filter(s => s.status === SubmissionStatus.SUBMITTED || s.status === SubmissionStatus.PENDING_AUTHORITY).length;
    this.approvedCount = this.submissions.filter(s => s.status === SubmissionStatus.APPROVED).length;
    this.queryCount = this.submissions.filter(s => s.status === SubmissionStatus.TECHNICAL_QUERY).length;
  }

  initCharts() {
    // Market Distribution
    const marketCounts = new Map<string, number>();
    Object.values(Market).forEach(m => marketCounts.set(m as string, 0));
    this.submissions.forEach(s => {
      marketCounts.set(s.market, (marketCounts.get(s.market) || 0) + 1);
    });

    this.marketChartData = {
      labels: Array.from(marketCounts.keys()),
      datasets: [
        {
          label: 'Submissões por Mercado',
          backgroundColor: '#003366',
          data: Array.from(marketCounts.values())
        }
      ]
    };

    // Status Distribution
    const statusCounts = new Map<string, number>();
    Object.values(SubmissionStatus).forEach(s => statusCounts.set(s as string, 0));
    this.submissions.forEach(s => {
      statusCounts.set(s.status, (statusCounts.get(s.status) || 0) + 1);
    });

    this.statusChartData = {
      labels: Array.from(statusCounts.keys()),
      datasets: [
        {
          data: Array.from(statusCounts.values()),
          backgroundColor: ['#6c757d', '#007bff', '#17a2b8', '#ffc107', '#28a745', '#dc3545', '#343a40']
        }
      ]
    };
  }

  getStatusColor(status: SubmissionStatus): string {
    switch (status) {
      case SubmissionStatus.APPROVED: return '#28a745';
      case SubmissionStatus.REJECTED: return '#dc3545';
      case SubmissionStatus.TECHNICAL_QUERY: return '#ffc107';
      default: return '#007bff';
    }
  }

  getStatusIcon(status: SubmissionStatus): string {
    switch (status) {
      case SubmissionStatus.APPROVED: return 'pi pi-check';
      case SubmissionStatus.REJECTED: return 'pi pi-times';
      case SubmissionStatus.TECHNICAL_QUERY: return 'pi pi-question';
      default: return 'pi pi-send';
    }
  }
}
