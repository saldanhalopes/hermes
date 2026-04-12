import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CapaService } from '../../../services/capa.service';
import { CapaStatus } from '../../../models/capa.model';

@Component({
  selector: 'app-capa-wizard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    StepperModule, ButtonModule, InputTextModule, 
    TextareaModule, DropdownModule, CheckboxModule, 
    CardModule, FloatLabelModule
  ],
  templateUrl: './capa-wizard.html',
  styleUrl: './capa-wizard.css'
})
export class CapaWizardComponent implements OnInit {
  capaForm!: FormGroup;
  sources = [
    { label: 'Auditoria Interna', value: 'AUDIT_INTERNAL' },
    { label: 'Auditoria Externa', value: 'AUDIT_EXTERNAL' },
    { label: 'Desvio de Qualidade', value: 'DEVIATION' },
    { label: 'Reclamação de Cliente', value: 'COMPLAINT' },
    { label: 'Auto-Inspeção', value: 'SELF_INSPECTION' }
  ];

  criticalityLevels = [
    { label: 'Baixa', value: 'LOW' },
    { label: 'Média', value: 'MEDIUM' },
    { label: 'Alta', value: 'HIGH' },
    { label: 'Crítica', value: 'CRITICAL' }
  ];

  constructor(
    private fb: FormBuilder,
    private capaService: CapaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.capaForm = this.fb.group({
      // Step 1: Origin
      title: ['', Validators.required],
      description: ['', Validators.required],
      source: ['', Validators.required],
      criticality: ['MEDIUM', Validators.required],
      
      // Step 2: RCA (5 Whys)
      why1: ['', Validators.required],
      why2: [''],
      why3: [''],
      why4: [''],
      why5: [''],
      rootCauseFinal: ['', Validators.required],
      
      // Step 3: Action Plan
      actions: this.fb.array([])
    });

    // Add initial action
    this.addAction();
  }

  suggestRCA() {
    const problem = this.capaForm.get('description')?.value;
    if (problem) {
      this.capaService.suggestRCA(problem).subscribe(res => {
        this.capaForm.patchValue({ rootCauseFinal: res });
      });
    }
  }

  get actions(): FormArray {
    return this.capaForm.get('actions') as FormArray;
  }

  addAction() {
    const actionGroup = this.fb.group({
      description: ['', Validators.required],
      type: ['CORRECTIVE', Validators.required],
      responsible: ['', Validators.required],
      deadline: ['', Validators.required]
    });
    this.actions.push(actionGroup);
  }

  removeAction(index: number) {
    this.actions.removeAt(index);
  }

  saveCapa() {
    if (this.capaForm.valid) {
      const payload = {
        ...this.capaForm.value,
        status: CapaStatus.INVESTIGATION
      };
      
      this.capaService.create(payload).subscribe({
        next: (res) => {
          this.router.navigate(['/capa', res.id]);
        },
        error: (err) => console.error('Error saving CAPA', err)
      });
    }
  }
}
