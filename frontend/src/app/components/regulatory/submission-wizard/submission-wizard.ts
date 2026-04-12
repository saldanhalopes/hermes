import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { RegulatoryService } from '../../../services/regulatory.service';
import { ChangeControlService } from '../../../services/change-control.service';
import { RegulatorySubmission, Market, SubmissionType, SubmissionStatus } from '../../../models/regulatory.model';
import { ChangeRequest, ChangeStatus } from '../../../models/change-request.model';

@Component({
  selector: 'app-submission-wizard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepperModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    TagModule,
    ButtonModule,
    TextareaModule
  ],
  templateUrl: './submission-wizard.html',
  styleUrls: ['./submission-wizard.css']
})
export class SubmissionWizardComponent implements OnInit {
  submission: RegulatorySubmission = {
    title: '',
    market: Market.BRAZIL,
    authority: '',
    type: SubmissionType.NOTIFICATION,
    status: SubmissionStatus.DRAFT,
    submissionDate: new Date()
  };

  markets = Object.values(Market).map((m: Market) => ({ label: m, value: m }));
  types = Object.values(SubmissionType).map((t: SubmissionType) => ({ label: t, value: t }));

  availableChanges: ChangeRequest[] = [];
  selectedChanges: ChangeRequest[] = [];
  
  saving = false;

  constructor(
    private regulatoryService: RegulatoryService,
    private changeControlService: ChangeControlService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAvailableChanges();
  }

  loadAvailableChanges() {
    this.changeControlService.getRequests().subscribe((data: ChangeRequest[]) => {
      // Filter for changes that are approved or in execution but not closed
      // This logic can be refined on the backend for better accuracy
      this.availableChanges = data.filter((cr: ChangeRequest) => cr.status !== ChangeStatus.CLOSED && cr.status !== ChangeStatus.ABANDONED);
    });
  }

  getGxpImpactMessage(): string {
    if (!this.submission.type) return '';
    
    if (this.submission.type === SubmissionType.PRIOR_APPROVAL || 
        this.submission.type === SubmissionType.MAJOR_VARIATION || 
        this.submission.type === SubmissionType.RE_REGISTRATION) {
      return 'Esta submissão BLOQUEARÁ o encerramento do CM até que seja APORVADA pela autoridade sanitária.';
    }
    
    return 'Esta submissão permite o encerramento do CM assim que for PROTOCOLADA (Status: Submitted).';
  }

  saveSubmission() {
    this.saving = true;
    const changeIds = this.selectedChanges.map((c: ChangeRequest) => c.id as number);
    
    this.regulatoryService.create(this.submission, changeIds).subscribe({
      next: (data: RegulatorySubmission) => {
        this.saving = false;
        this.router.navigate(['/regulatory']);
      },
      error: (err: any) => {
        console.error('Erro ao criar submissão', err);
        this.saving = false;
      }
    });
  }
}
