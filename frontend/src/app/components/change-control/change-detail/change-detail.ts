import mermaid from 'mermaid';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChangeControlService } from '../../../services/change-control.service';
import { ChangeRequest } from '../../../models/change-request.model';
import { RegulatorySubmission } from '../../../models/regulatory.model';
import { RegulatoryService } from '../../../services/regulatory.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { AuditTimelineComponent } from '../audit-timeline/audit-timeline';
import { AiService } from '../../../services/ai.service';
import { SignatureDialogComponent } from '../../shared/signature-dialog/signature-dialog.component';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-change-detail',
  standalone: true,
  imports: [
    CommonModule, CardModule, ButtonModule, TagModule, 
    TimelineModule, RouterModule, DialogModule, 
    InputTextModule, FormsModule, TableModule,
    AccordionModule, BadgeModule, AuditTimelineComponent,
    SignatureDialogComponent, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './change-detail.html',
  styleUrl: './change-detail.css'
})


export class ChangeDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('mermaidContainer') mermaidContainer!: ElementRef;
  request?: ChangeRequest;
  loading = true;
  showSignatureModal = false;
  signaturePassword = '';
  aiLoading = false;
  regulatorySubmissions: RegulatorySubmission[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: ChangeControlService,
    private regulatoryService: RegulatoryService,
    private aiService: AiService,
    private messageService: MessageService
  ) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    });
  }


  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.service.getRequest(id).subscribe({
        next: (data) => {
          this.request = data;
          this.loading = false;
          setTimeout(() => this.renderMermaid(), 100);
          this.loadRegulatorySubmissions(id);
        },
        error: () => this.loading = false
      });
    }
  }

  ngAfterViewInit() {
    // Initial render handled in ngOnInit after data load
  }

  renderMermaid() {
    if (!this.request || !this.mermaidContainer) return;

    const status = this.request.status;
    const definition = `
      graph LR;
      ID((1)):::ident --> IA((2)):::impact;
      IA --> RR((3)):::reg;
      RR --> AE((4)):::area;
      AE --> CR((5)):::committee;
      CR --> AP((6)):::plan;
      AP --> EX((7)):::exec;
      EX --> EV((8)):::eff;
      EV --> CL((9)):::closed;
      
      classDef default fill:#f8fafc,stroke:#e2e8f0,stroke-width:2px,color:#64748b;
      classDef active fill:#6366f1,stroke:#6366f1,stroke-width:4px,color:#fff;
      classDef done fill:#10b981,stroke:#10b981,stroke-width:2px,color:#fff;
      
      ${this.getStatusClasses(status)}
    `;

    const element = this.mermaidContainer.nativeElement;
    (mermaid as any).render('mermaid-chart', definition).then((res: any) => {
        element.innerHTML = res.svg;
    });


  }

  getStatusClasses(status: string): string {
    switch (status) {
        case "IDENTIFICATION": return "class ID active;";
        case "IMPACT_ANALYSIS": return "class ID done; class IA active;";
        case "REGULATORY_REVIEW": return "class ID,IA done; class RR active;";
        case "AREA_EVALUATION": return "class ID,IA,RR done; class AE active;";
        case "COMMITTEE_REVIEW": return "class ID,IA,RR,AE done; class CR active;";
        case "ACTION_PLAN":
        case "ACTION_PLAN_APPROVAL": return "class ID,IA,RR,AE,CR done; class AP active;";
        case "EXECUTION": return "class ID,IA,RR,AE,CR,AP done; class EX active;";
        case "EFFECTIVENESS_VERIFICATION": return "class ID,IA,RR,AE,CR,AP,EX done; class EV active;";
        case "CLOSED": return "class ID,IA,RR,AE,CR,AP,EX,EV,CL done;";
        default: return "";
    }
  }

  getAISuggestion(analysis: any) {
    if (!this.request?.id) return;
    
    this.aiLoading = true;
    this.aiService.analyzeImpact(this.request.id).subscribe({
        next: (suggestion) => {
            this.aiLoading = false;
            this.messageService.add({ severity: 'success', summary: 'IA Consultada', detail: 'Hermes Genius gerou uma análise técnica.' });
            
            // Typewriter effect
            let i = 0;
            const targetText = suggestion;
            this.request!.impactAnalysis = "";
            const interval = setInterval(() => {
                this.request!.impactAnalysis += targetText.charAt(i);
                i++;
                if (i >= targetText.length) {
                    clearInterval(interval);
                }
            }, 15);
        },
        error: () => {
            this.aiLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Falha na IA', detail: 'Não foi possível conectar ao Hermes Genius' });
        }
    });
  }

  onApproveClick() {
    this.showSignatureModal = true;
  }

  confirmSignature(password: string) {
    if (!this.request?.id) return;
    
    this.aiLoading = true; // Use loading state for signature call too
    this.service.approveWithSignature(this.request.id, password).subscribe({
        next: () => {
            this.showSignatureModal = false;
            this.aiLoading = false;
            this.messageService.add({ severity: 'success', summary: 'CM Aprovado', detail: 'Transação assinada e registrada com sucesso' });
            this.ngOnInit(); // Refresh
        },
        error: (err) => {
            this.aiLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Falha na Assinatura', detail: err.error?.message || 'Senha inválida' });
        }
    });
  }

  loadRegulatorySubmissions(changeId: number) {
    this.regulatoryService.getByChangeRequestId(changeId).subscribe(data => {
      this.regulatorySubmissions = data;
    });
  }
}
