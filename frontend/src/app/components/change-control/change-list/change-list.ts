import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeControlService } from '../../../services/change-control.service';
import { ChangeRequest } from '../../../models/change-request.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-change-list',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    RouterModule, 
    IconFieldModule, 
    InputIconModule, 
    InputTextModule, 
    TooltipModule,
    BadgeModule
  ],
  templateUrl: './change-list.html',
  styleUrl: './change-list.css'
})


export class ChangeListComponent implements OnInit {
  changes: ChangeRequest[] = [];
  loading = true;
  searchValue = '';

  constructor(private service: ChangeControlService) {}

  ngOnInit() {
    this.service.getRequests().subscribe({
      next: (data) => {
        this.changes = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getSeverity(status: string): "success" | "secondary" | "info" | "danger" | "contrast" | "warn" {
    switch (status) {
      case 'CLOSED':
        return 'success';
      case 'EXECUTION':
        return 'info';
      case 'IDENTIFICATION':
        return 'secondary';
      case 'ABANDONED':
        return 'danger';
      default:
        return 'warn';
    }
  }

}
