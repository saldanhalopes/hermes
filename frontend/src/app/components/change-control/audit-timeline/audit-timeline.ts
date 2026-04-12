import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ChangeControlService } from '../../../services/change-control.service';

@Component({
  selector: 'app-audit-timeline',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule],
  templateUrl: './audit-timeline.html',
  styleUrl: './audit-timeline.css'
})
export class AuditTimelineComponent implements OnInit {
  @Input() requestId!: number;
  events: any[] = [];

  constructor(private changeService: ChangeControlService) {}

  ngOnInit() {
    if (this.requestId) {
      this.loadHistory();
    }
  }

  loadHistory() {
    this.changeService.getHistory(this.requestId).subscribe(data => {
      this.events = data.map(event => ({
        status: event.operation,
        date: event.timestamp,
        icon: this.getIcon(event.operation),
        color: this.getColor(event.operation),
        user: event.user,
        description: event.entityName
      }));
    });
  }

  getIcon(op: string) {
    switch (op) {
      case 'CRIAÇÃO': return 'pi pi-plus-circle';
      case 'EDIÇÃO': return 'pi pi-pencil';
      case 'EXCLUSÃO': return 'pi pi-trash';
      default: return 'pi pi-info-circle';
    }
  }

  getColor(op: string) {
    switch (op) {
      case 'CRIAÇÃO': return '#10B981'; // Emerald
      case 'EDIÇÃO': return '#3B82F6'; // Blue
      case 'EXCLUSÃO': return '#EF4444'; // Red
      default: return '#64748B'; // Slate
    }
  }
}
