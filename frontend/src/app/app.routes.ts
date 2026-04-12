import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ChangeListComponent } from './components/change-control/change-list/change-list';
import { ChangeDetailComponent } from './components/change-control/change-detail/change-detail';
import { WizardCRComponent } from './components/change-control/wizard-cr/wizard-cr';
import { CapaListComponent } from './components/capa/capa-list/capa-list';
import { CapaRadarComponent } from './components/capa/capa-radar/capa-radar';
import { CapaWizardComponent } from './components/capa/capa-wizard/capa-wizard';
import { CapaDetailComponent } from './components/capa/capa-detail/capa-detail';
import { RegulatoryDashboardComponent } from './components/regulatory/regulatory-dashboard/regulatory-dashboard';
import { SubmissionListComponent } from './components/regulatory/submission-list/submission-list';
import { SubmissionWizardComponent } from './components/regulatory/submission-wizard/submission-wizard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'change-control', component: ChangeListComponent },
  { path: 'change-control/new', component: WizardCRComponent },
  { path: 'change-control/:id', component: ChangeDetailComponent },
  { path: 'capa', component: CapaListComponent },
  { path: 'capa/radar', component: CapaRadarComponent },
  { path: 'capa/new', component: CapaWizardComponent },
  { path: 'capa/:id', component: CapaDetailComponent },
  { path: 'regulatory', component: RegulatoryDashboardComponent },
  { path: 'regulatory/list', component: SubmissionListComponent },
  { path: 'regulatory/new', component: SubmissionWizardComponent }
];
