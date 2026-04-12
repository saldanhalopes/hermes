export enum ChangeStatus {
    IDENTIFICATION = 'IDENTIFICATION',
    IMPACT_ANALYSIS = 'IMPACT_ANALYSIS',
    REGULATORY_REVIEW = 'REGULATORY_REVIEW',
    AREA_EVALUATION = 'AREA_EVALUATION',
    COMMITTEE_REVIEW = 'COMMITTEE_REVIEW',
    ACTION_PLAN = 'ACTION_PLAN',
    ACTION_PLAN_APPROVAL = 'ACTION_PLAN_APPROVAL',
    EXECUTION = 'EXECUTION',
    EFFECTIVENESS_VERIFICATION = 'EFFECTIVENESS_VERIFICATION',
    CLOSED = 'CLOSED',
    ABANDONED = 'ABANDONED'
}

export interface ChangeRequest {
    id?: number;
    cmNumber?: string;
    title: string;
    openingDate?: string;
    responsibleName: string;
    responsibleArea: string;
    unit: string;
    changeType: string;
    changeSubtype: string;
    criticality: string;
    currentSituation: string;
    proposedSituation: string;
    justification: string;
    affectedProducts: string;
    emergency: boolean;
    emergencyReason?: string;
    relatedCms?: string;
    status: ChangeStatus;
    createdAt?: string;
    updatedAt?: string;
    impactAnalysis?: string;
    impactAnalyses?: any[];
    actionPlanTasks?: any[];
    effectivenessEvaluation?: any;
}
