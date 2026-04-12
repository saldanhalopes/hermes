export enum CapaStatus {
    DRAFT = 'DRAFT',
    INVESTIGATION = 'INVESTIGATION',
    ROOT_CAUSE_ANALYSIS = 'ROOT_CAUSE_ANALYSIS',
    ACTION_PLAN_DEFINITION = 'ACTION_PLAN_DEFINITION',
    ACTION_PLAN_EXECUTION = 'ACTION_PLAN_EXECUTION',
    EFFECTIVENESS_VERIFICATION = 'EFFECTIVENESS_VERIFICATION',
    CLOSED = 'CLOSED',
    VOID = 'VOID'
}

export interface CapaAction {
    id?: number;
    description: string;
    type: 'CORRECTIVE' | 'PREVENTIVE';
    responsible: string;
    deadline: string;
    completedDate?: string;
    completed: boolean;
}

export interface Capa {
    id?: number;
    capaNumber?: string;
    title: string;
    description: string;
    source: string;
    status: CapaStatus;
    criticality: string;
    openingDate?: string;
    
    // RCA
    why1?: string;
    why2?: string;
    why3?: string;
    why4?: string;
    why5?: string;
    rootCauseFinal?: string;

    actions: CapaAction[];
}
