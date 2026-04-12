import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ChangeControlService } from '../../../services/change-control.service';
import { ChangeStatus } from '../../../models/change-request.model';

@Component({
  selector: 'app-wizard-cr',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    StepperModule, ButtonModule, InputTextModule, 
    TextareaModule, DropdownModule, CheckboxModule, 
    CardModule, FloatLabelModule, IconFieldModule, InputIconModule
  ],
  templateUrl: './wizard-cr.html',
  styleUrl: './wizard-cr.css'
})
export class WizardCRComponent implements OnInit {
  wizardForm!: FormGroup;
  changeTypes = [
    { label: 'Documentação', value: 'DOCUMENTATION' },
    { label: 'Processo', value: 'PROCESS' },
    { label: 'Equipamento', value: 'EQUIPMENT' },
    { label: 'Sistemas Computadorizados', value: 'COMPUTER_SYSTEMS' }
  ];

  criticalityLevels = [
    { label: 'Baixa', value: 'BAIXA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Crítica', value: 'CRITICA' }
  ];

  constructor(
    private fb: FormBuilder,
    private changeService: ChangeControlService,
    private router: Router
  ) {}

  ngOnInit() {
    this.wizardForm = this.fb.group({
      // Stage 1: Identification
      title: ['', Validators.required],
      changeType: ['', Validators.required],
      unit: ['Eurofarma Itapevi', Validators.required],
      responsibleName: ['', Validators.required],
      responsibleArea: ['', Validators.required],
      
      // Stage 2: Context
      currentSituation: ['', Validators.required],
      proposedSituation: ['', Validators.required],
      
      // Stage 3: Impact
      affectedProducts: [''],
      emergency: [false],
      emergencyReason: [''],
      
      // Stage 4: Justification
      justification: ['', Validators.required],
      criticality: ['MEDIA', Validators.required]
    });
  }

  saveCR() {
    if (this.wizardForm.valid) {
      const payload = {
        ...this.wizardForm.value,
        status: ChangeStatus.IDENTIFICATION
      };
      
      this.changeService.createRequest(payload).subscribe(res => {
        this.router.navigate(['/change-control', res.id]);
      });
    }
  }
}
