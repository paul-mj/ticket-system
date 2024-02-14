
/* Sajin 19-03-2023 */

export interface WorkFlowFormData {
    workFlowForm: workFlowForm;
    workFlowTable: WorkFlowTable["workFlowTable"];
}

export interface workFlowForm   {
    code: string | undefined;
    workFlowNameinArabic: string | undefined;
    workFlowNameinEnglish: string | undefined;
    Remarks: string | undefined;
    Active: boolean,
}

export interface WorkFlowTable  {
    workFlowTable: WorkFlowTableRow[]; 
}

export interface WorkFlowTableRow {
    FromStatus: number | null;
    ToStatus: number | null;
    RoleName: number | null;
    code: string | undefined;
    IsFinal: boolean;
    Role1: number | null;
    Role2: number | null;
    Delete: boolean;
}
