import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CapaService } from '../../../services/capa.service';

@Component({
  selector: 'app-capa-radar',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, RouterModule, ButtonModule],
  templateUrl: './capa-radar.html',
  styleUrl: './capa-radar.css'
})
export class CapaRadarComponent implements OnInit {
  statusChartData: any;
  sourceChartData: any;
  chartOptions: any;

  kpis = {
    totalOpen: 12,
    overdue: 3,
    avgClosureTime: '42 dias',
    investigationProgress: 85
  };

  constructor(private capaService: CapaService) {}

  ngOnInit() {
    this.initCharts();
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

  initCharts() {
    this.statusChartData = {
      labels: ['Investigação', 'Plano de Ação', 'Verificação', 'Encerrado'],
      datasets: [
        {
          data: [5, 4, 2, 10],
          backgroundColor: ['#38BDF8', '#F59E0B', '#0D9488', '#64748B'],
          hoverBackgroundColor: ['#0EA5E9', '#D97706', '#0F766E', '#475569']
        }
      ]
    };

    this.sourceChartData = {
      labels: ['Auditoria', 'Desvio', 'Reclamação', 'Auto-inspeção'],
      datasets: [
        {
          label: 'CAPAs por Origem',
          data: [8, 15, 4, 6],
          backgroundColor: 'rgba(13, 148, 136, 0.2)',
          borderColor: '#0D9488',
          borderWidth: 2,
          fill: true
        }
      ]
    };
  }
}
