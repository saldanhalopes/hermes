import { ChangeRequest } from './change-request.model';

export enum Market {
  BRAZIL = 'BRAZIL',
  MEXICO = 'MEXICO',
  COLOMBIA = 'COLOMBIA',
  CHILE = 'CHILE',
  PERU = 'PERU',
  ARGENTINA = 'ARGENTINA',
  USA = 'USA',
  EUROPE = 'EUROPE'
}

export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING_AUTHORITY = 'PENDING_AUTHORITY',
  TECHNICAL_QUERY = 'TECHNICAL_QUERY',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum SubmissionType {
  RE_REGISTRATION = 'RE_REGISTRATION',
  NOTIFICATION = 'NOTIFICATION',
  IMMEDIATE_IMPLEMENTATION = 'IMMEDIATE_IMPLEMENTATION',
  PRIOR_APPROVAL = 'PRIOR_APPROVAL',
  MINOR_VARIATION = 'MINOR_VARIATION',
  MAJOR_VARIATION = 'MAJOR_VARIATION'
}

export interface RegulatorySubmission {
  id?: number;
  submissionNumber?: string;
  title: string;
  market: Market;
  authority: string;
  type: SubmissionType;
  status: SubmissionStatus;
  submissionDate?: string | Date;
  approvalDate?: string | Date;
  dossierLink?: string;
  notes?: string;
  changeRequests?: ChangeRequest[];
  createdAt?: string;
  updatedAt?: string;
}
