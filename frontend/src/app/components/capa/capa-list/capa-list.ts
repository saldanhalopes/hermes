import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CapaService } from '../../../services/capa.service';
import { Capa } from '../../../models/capa.model';

@Component({
  selector: 'app-capa-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, TableModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule, 
    BadgeModule, TagModule, TooltipModule
  ],
  templateUrl: './capa-list.html',
  styleUrl: './capa-list.css'
})
export class CapaListComponent implements OnInit {
  capas: Capa[] = [];
  loading: boolean = true;

  constructor(private capaService: CapaService) {}

  ngOnInit() {
    this.loadCapas();
  }

  loadCapas() {
    this.loading = true;
    this.capaService.getAll().subscribe({
      next: (data) => {
        this.capas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading CAPAs', err);
        this.loading = false;
      }
    });
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'CLOSED': return 'success';
      case 'INVESTIGATION': return 'info';
      case 'DRAFT': return 'secondary';
      case 'ACTION_PLAN_EXECUTION': return 'warn';
      case 'EFFECTIVENESS_VERIFICATION': return 'success';
      case 'VOID': return 'danger';
      default: return 'info';
    }
  }
}
