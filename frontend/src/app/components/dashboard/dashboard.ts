import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})



export class DashboardComponent implements OnInit {
  analyticsData?: AnalyticsData;
  typeChartData: any;
  trendChartData: any;
  chartOptions: any;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.getAnalytics().subscribe(data => {
      this.analyticsData = data;
      this.initCharts(data);
    });

    this.chartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };
  }

  initCharts(data: AnalyticsData) {
    this.typeChartData = {
      labels: Object.keys(data.typeDistribution),
      datasets: [
        {
          data: Object.values(data.typeDistribution),
          backgroundColor: ['#0D9488', '#0A192F', '#38BDF8', '#64748B'], // Teal, Navy, Sky, Slate
          hoverBackgroundColor: ['#0F766E', '#111827', '#0EA5E9', '#475569']
        }
      ]
    };

    this.trendChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Solicitações de Mudança',
          data: data.monthlyTrend,
          fill: true,
          borderColor: '#0D9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          tension: .4,
          pointBackgroundColor: '#0D9488',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }
}
