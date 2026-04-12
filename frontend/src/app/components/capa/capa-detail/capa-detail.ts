import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TimelineModule } from 'primeng/timeline';
import { AccordionModule } from 'primeng/accordion';
import { CapaService } from '../../../services/capa.service';
import { Capa, CapaStatus } from '../../../models/capa.model';

@Component({
  selector: 'app-capa-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, CardModule, TableModule, 
    ButtonModule, BadgeModule, TimelineModule, AccordionModule
  ],
  templateUrl: './capa-detail.html',
  styleUrl: './capa-detail.css'
})
export class CapaDetailComponent implements OnInit {
  protected readonly CapaStatus = CapaStatus;
  capa!: Capa;
  loading: boolean = true;
  auditTimeline: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private capaService: CapaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadCapa(id);
  }

  loadCapa(id: number) {
    this.loading = true;
    this.capaService.getById(id).subscribe({
      next: (data) => {
        this.capa = data;
        this.loading = false;
        this.initMockTimeline();
      },
      error: (err) => {
        console.error('Error loading CAPA', err);
        this.loading = false;
      }
    });
  }

  initMockTimeline() {
    this.auditTimeline = [
      { status: 'DRAFT', date: this.capa.openingDate, icon: 'pi pi-plus', color: '#64748B', desc: 'Registro inicial criado' },
      { status: 'INVESTIGATION', date: new Date(), icon: 'pi pi-search', color: '#38BDF8', desc: 'Investigação de causa raiz iniciada' }
    ];
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'CLOSED': return 'success';
      case 'INVESTIGATION': return 'info';
      case 'DRAFT': return 'secondary';
      case 'ACTION_PLAN_EXECUTION': return 'warn';
      case 'EFFECTIVENESS_VERIFICATION': return 'success';
      default: return 'info';
    }
  }

  transitionStatus(newStatus: CapaStatus) {
    // Logic for E-Signature would be triggered here
    this.capaService.updateStatus(this.capa.id!, newStatus).subscribe(res => {
      this.capa.status = res;
      this.initMockTimeline();
    });
  }
}
