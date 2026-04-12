import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signature-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, PasswordModule, ButtonModule],
  template: `
    <p-dialog [(visible)]="visible" [header]="header" [modal]="true" [style]="{width: '450px'}" [closable]="false">
      <div class="flex flex-column gap-3 py-3">
        <p class="m-0 text-secondary">
          Esta ação requer uma assinatura eletrônica vinculada à sua conta. 
          Ao assinar, você confirma que revisou e aprova os dados desta transação conforme as diretrizes GxP.
        </p>

        <div class="p-2 border-round bg-yellow-50 border-1 border-yellow-100 mb-2">
          <p class="text-xs text-yellow-800 m-0">
            <i class="pi pi-shield mr-1"></i>
            <strong>Declaração Legal:</strong> Esta assinatura eletrônica é o equivalente legal de uma assinatura manuscrita, conforme as diretrizes da <strong>21 CFR Part 11</strong> e normas locais vigentes.
          </p>
        </div>
        
        <div class="field">
          <label for="password" class="block font-bold mb-2">Sua Senha</label>
          <p-password 
            [(ngModel)]="password" 
            [feedback]="false" 
            [toggleMask]="true" 
            styleClass="w-full" 
            inputStyleClass="w-full"
            id="password"
            placeholder="Digite sua senha para confirmar"
            (keyup.enter)="confirm()">
          </p-password>
        </div>

        <div class="flex align-items-center gap-2 p-2 border-round surface-100">
          <i class="pi pi-info-circle text-primary"></i>
          <span class="text-sm">Intenção: <strong>{{ intent }}</strong></span>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="cancel()"></p-button>
        <p-button label="Assinar e Confirmar" icon="pi pi-check" [loading]="loading" (onClick)="confirm()" [disabled]="!password"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .p-dialog .p-dialog-header {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      padding: 1.5rem;
    }
    
    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.5rem;
      background: white;
    }

    :host ::ng-deep .p-password input {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }

    :host ::ng-deep .p-password input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .compliance-text {
      line-height: 1.5;
      color: #64748b;
    }
  `]
})
export class SignatureDialogComponent {
  @Input() visible = false;
  @Input() header = 'Assinatura Eletrônica';
  @Input() intent = 'Aprovação de Execução';
  @Input() loading = false;
  
  @Output() onConfirm = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();

  password = '';

  confirm() {
    if (this.password) {
      this.onConfirm.emit(this.password);
      this.password = '';
    }
  }

  cancel() {
    this.visible = false;
    this.password = '';
    this.onCancel.emit();
  }
}
