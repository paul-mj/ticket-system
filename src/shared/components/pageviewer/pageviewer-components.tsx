// index.ts

import CorrespondenceBrowse from "../../../pages/correspondence/correspondence-browse";
import ApplicationSettings from "../../../pages/masters/Application Settings/Application-Settings";
import { ApprovalEscalationForm } from "../../../pages/masters/configurations/approval-escalation-roles/approval-escalation";
import { MailRolesForm } from "../../../pages/masters/configurations/mail-roles/mail-roles-form";
import { MailRecordsForm } from "../../../pages/masters/configurations/main-records/mail-record-form";
import { MasterWorkFlow } from "../../../pages/masters/configurations/master-workflow/master-workflow";
import Designation from "../../../pages/masters/Designation/designation";
import EmailGroup from "../../../pages/masters/Email Group/EmailGroup";
import MasterForm from "../../../pages/masters/Master Form/MasterForm";
import ProcessStatus from "../../../pages/masters/Process Status/ProcessStatus";
import SubEntities from "../../../pages/masters/Sub Entities/SubEntities";
import { UserFormCreation } from "../../../pages/masters/User/UserFormCreation";
import UserGroup from "../../../pages/masters/User Group/UserGroup";
import UserRoles from "../../../pages/masters/User Roles/UserRoles";
import { WorkFlowCreation } from "../../../pages/masters/workflow/WorkFlowCreation";
import { ApprovalEscalationPeriod } from "../../../pages/masters/configurations/service-type-escalation-aproval-period/ApprovalEscalationPeriod";
import { TransactionApprovalOwnershipRole } from "../../../pages/masters/configurations/transaction-approval-ownership-role/serivce-mail-role";
import { LocalizationForm } from "../../../pages/masters/configurations/localization/localization-form";
import { MailTemplate } from "../../../pages/masters/Mail Template/MailTemplate";
import { MailtypeEmailTemplate } from "../../../pages/masters/configurations/mailtype-emailtemplate/MailtypeEmailTemplate";
import { ItcApplication } from "../../../pages/masters/ITC Application";
import UserResetPassword from "../../../pages/masters/Reset Password";
import Customers from "../../../pages/masters/Customers/Customers";
import { CorrespondenceView } from "../../../pages/correspondence/correspondance-view";
import { UserCreation } from "../../../pages/transactions/user-creation-request/UserCreationRequestDialog";
import ContactFullviewDialog from "../../../pages/contact/ContactFullviewDialog";



export const COMPONENTS = {
    DesignationDialog: Designation,
    FranchiseRequestTypeDialog: MasterForm,
    CustomersDialog: Customers,
    ITCApplicationsDialog: ItcApplication,
    DepartmentDialog: MasterForm,
    MeetingLocationDialog: MasterForm,
    ITCEntityDialog: MasterForm,
    ITCSubEntityDialog: SubEntities,
    UserRoleDialog: UserRoles,
    UserGroupDialog: UserGroup,
    ContactFormDialog: ContactFullviewDialog,
    ProcessStatusDialog: ProcessStatus,
    EmailGroupDialog: EmailGroup,
    CorrespondenceDialog: CorrespondenceBrowse,
    CorrespondenceViewDialog: CorrespondenceView,
    WorkFlowCreateDialog: WorkFlowCreation,
    UserDialog: UserFormCreation,
    MailRecordsDialog: MailRecordsForm,
    MailRolesDialog: MailRolesForm,
    UserCreationRequestDialog: UserCreation,
    ApprovalEscalationDialog: ApprovalEscalationForm,
    ApplicationSettingsDialog: ApplicationSettings,
    MasterWorkFlowDialog: MasterWorkFlow,
    ApprovalEscalationPeriodDialog: ApprovalEscalationPeriod,
    ConfigureTransactionOwnershipDialog: TransactionApprovalOwnershipRole,
    LocalizationDialog: LocalizationForm,
    MailtemplateDialog: MailTemplate,
    SetEmailTemplateDialog: MailtypeEmailTemplate,
    UserResetPassword,


};

export type ComponentKey = keyof typeof COMPONENTS;