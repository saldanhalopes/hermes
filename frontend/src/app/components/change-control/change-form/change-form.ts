import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChangeControlService } from '../../../services/change-control.service';
import { ChangeRequest, ChangeStatus } from '../../../models/change-request.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-change-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, TextareaModule, SelectModule, CheckboxModule, DatePickerModule, RouterModule],
  templateUrl: './change-form.html',
  styleUrl: './change-form.css'
})


export class ChangeFormComponent implements OnInit {
  request: ChangeRequest = {
    title: '',
    responsibleName: '',
    responsibleArea: '',
    unit: '',
    changeType: '',
    changeSubtype: '',
    criticality: '',
    currentSituation: '',
    proposedSituation: '',
    justification: '',
    affectedProducts: '',
    emergency: false,
    status: ChangeStatus.IDENTIFICATION
  };
  
  editMode = false;
  loading = false;

  units = ['Itapevi', 'Momenta', 'Rio de Janeiro', 'Caldireira'];
  types = ['Mudança Geral', 'Mudança de Emergência', 'Projeto'];
  subtypes = ['Definitivo', 'Temporário'];
  criticalities = ['Baixa', 'Média', 'Alta', 'Crítica'];

  constructor(
    private service: ChangeControlService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editMode = true;
      this.service.getRequest(id).subscribe(data => {
        this.request = data;
      });
    }
  }

  save() {
    this.loading = true;
    const obs = this.editMode && this.request.id
      ? this.service.updateRequest(this.request.id, this.request)
      : this.service.createRequest(this.request);

    obs.subscribe({
      next: () => {
        this.router.navigate(['/change-control']);
      },
      error: () => this.loading = false
    });
  }
}
