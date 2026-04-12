import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RegulatoryService } from '../../../services/regulatory.service';
import { RegulatorySubmission, SubmissionStatus } from '../../../models/regulatory.model';

@Component({
  selector: 'app-submission-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    CardModule,
    InputTextModule
  ],
  templateUrl: './submission-list.html',
  styleUrls: ['./submission-list.css']
})
export class SubmissionListComponent implements OnInit {
  submissions: RegulatorySubmission[] = [];
  loading = true;

  constructor(private regulatoryService: RegulatoryService) {}

  ngOnInit() {
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.loading = true;
    this.regulatoryService.getAll().subscribe({
      next: (data: RegulatorySubmission[]) => {
        this.submissions = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar submissões', err);
        this.loading = false;
      }
    });
  }

  getSeverity(status: SubmissionStatus): "success" | "info" | "warn" | "danger" | "secondary" {
    switch (status) {
      case SubmissionStatus.APPROVED:
        return 'success';
      case SubmissionStatus.SUBMITTED:
      case SubmissionStatus.PENDING_AUTHORITY:
        return 'info';
      case SubmissionStatus.TECHNICAL_QUERY:
        return 'warn';
      case SubmissionStatus.REJECTED:
      case SubmissionStatus.WITHDRAWN:
        return 'danger';
      case SubmissionStatus.DRAFT:
      default:
        return 'secondary';
    }
  }

  getStatusClass(status: SubmissionStatus): string {
    switch (status) {
      case SubmissionStatus.APPROVED: return 'success';
      case SubmissionStatus.SUBMITTED:
      case SubmissionStatus.PENDING_AUTHORITY: return 'info';
      case SubmissionStatus.TECHNICAL_QUERY: return 'warning';
      case SubmissionStatus.REJECTED:
      case SubmissionStatus.WITHDRAWN: return 'danger';
      default: return 'info';
    }
  }
}
