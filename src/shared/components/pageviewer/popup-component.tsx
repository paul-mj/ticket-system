import localStore from "../../../common/browserstore/localstore";
import { MasterId, MenuId, TaskType, UserType } from "../../../common/database/enums";

export const popupComponent = (masterDetails: any, actionMenu: any, rowData?: any) => {
    console.log(actionMenu, 'action Menu action Menu action Menu', masterDetails)
    const userData = localStore.getLoggedInfo();
    const userType = userData && JSON.parse(userData).USER_TYPE;
    let config = {};
    switch (actionMenu.MenuId) {
        case MenuId.New:
            switch (masterDetails.MASTER_ID) {
                case MasterId.Designations:
                    config = {
                        DialogName: "DesignationDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID

                    };
                    break;
                case MasterId.FranchiseRequestType:
                    config = {
                        DialogName: "FranchiseRequestTypeDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ITCApplications:
                    config = {
                        DialogName: "ITCApplicationsDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Departments:
                    config = {
                        DialogName: "DepartmentDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.MeetingLocations:
                    config = {
                        DialogName: "MeetingLocationDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.ITCEntities:
                    config = {
                        DialogName: "ITCEntityDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ITCSubEntities:
                    config = {
                        DialogName: "ITCSubEntityDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Customers:
                    config = {
                        DialogName: "CustomersDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.WorkFlow:
                    config = {
                        DialogName: "WorkFlowCreateDialog",
                        FullWidth: true,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserRole:
                    config = {
                        DialogName: "UserRoleDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserGroup:
                    config = {
                        DialogName: "UserGroupDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ProcessStatus:
                    config = {
                        DialogName: "ProcessStatusDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.EmailGroup:
                    config = {
                        DialogName: "EmailGroupDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Correspondence:
                case MasterId.Announcements:
                case MasterId.Circulars:
                case MasterId.Resolutions:
                case MasterId.Communications:
                case MasterId.Tasks:
                case MasterId.Events:
                case MasterId.Requests:
                case MasterId.Meetings:
                case MasterId.Communication:
                case MasterId.NoticeBoardDesign:
                    config = {
                        DialogName: "CorrespondenceDialog",
                        FullWidth: false,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.RecurringTask:
                    config = {
                        DialogName: "RecurringTaskBrowse",
                        FullWidth: false,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break
                case MasterId.UserID:
                    config = {
                        DialogName: "UserDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Gallery:
                    config = {
                        DialogName: "GalleryDialog",
                        FullWidth: true,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserCreationRequest:
                case MasterId.UserRemovalRequest:
                case MasterId.UserModificationRequest:
                    config = {
                        DialogName: "UserCreationRequestDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    }
                    break;
                case MasterId.Contact:
                    config = {
                        DialogName: "ContactFormDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Mailtemplate:
                    config = {
                        DialogName: "MailtemplateDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
            }
            break;


                       
        case MenuId.Edit:
            switch (masterDetails.MASTER_ID) {
                case MasterId.Designations:
                    config = {
                        DialogName: "DesignationDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.ITCSubEntities:
                    config = {
                        DialogName: "ITCSubEntityDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                    case MasterId.Customers:
                    config = {
                        DialogName: "CustomersDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.FranchiseRequestType:
                    config = {
                        DialogName: "FranchiseRequestTypeDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ITCApplications:
                    config = {
                        DialogName: "ITCApplicationsDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.Departments:
                    config = {
                        DialogName: "DepartmentDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.MeetingLocations:
                    config = {
                        DialogName: "MeetingLocationDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ITCEntities:
                    config = {
                        DialogName: "ITCEntityDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ProcessStatus:
                    config = {
                        DialogName: "ProcessStatusDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.WorkFlow:
                    config = {
                        DialogName: "WorkFlowCreateDialog",
                        FullWidth: true,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;

                case MasterId.UserRole:
                    config = {
                        DialogName: "UserRoleDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.EmailGroup:
                    config = {
                        DialogName: "EmailGroupDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserGroup:
                    config = {
                        DialogName: "UserGroupDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Correspondence:
                case MasterId.Announcements:
                case MasterId.Circulars:
                case MasterId.Resolutions:
                case MasterId.Communications:
                case MasterId.Tasks:
                case MasterId.Events:
                case MasterId.Requests:
                case MasterId.Meetings:
                case MasterId.Communication:
                case MasterId.NoticeBoardDesign:
                    config = {
                        DialogName: "CorrespondenceDialog",
                        FullWidth: false,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.RecurringTask:
                    config = {
                        DialogName: "RecurringTaskBrowse",
                        FullWidth: false,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break
                case MasterId.UserID:
                    config = {
                        DialogName: "UserDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Gallery:
                    config = {
                        DialogName: "GalleryDialog",
                        FullWidth: true,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Contact:
                    config = {
                        DialogName: "ContactFormDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserCreationRequest:
                case MasterId.UserRemovalRequest:
                case MasterId.UserModificationRequest:
                    config = {
                        DialogName: "UserCreationRequestDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    }
                    break;
                case MasterId.Mailtemplate:
                    config = {
                        DialogName: "MailtemplateDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
            }
            break;
          
        case MenuId.View:
            switch (masterDetails.MASTER_ID) {
                case MasterId.Designations:
                    config = {
                        DialogName: "DesignationDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ITCEntities:
                    config = {
                        DialogName: "ITCEntityDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ITCSubEntities:
                    config = {
                        DialogName: "ITCSubEntityDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                    case MasterId.Customers:
                    config = {
                        DialogName: "CustomersDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ITCApplications:
                    config = {
                        DialogName: "ITCApplicationsDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.FranchiseRequestType:
                    config = {
                        DialogName: "FranchiseRequestTypeDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Departments:
                    config = {
                        DialogName: "DepartmentDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.MeetingLocations:
                    config = {
                        DialogName: "MeetingLocationDialog",
                        FullWidth: true, 
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.WorkFlow:
                    config = {
                        DialogName: "WorkFlowCreateDialog",
                        FullWidth: true,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.EmailGroup:
                    config = {
                        DialogName: "EmailGroupDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.ProcessStatus:
                    config = {
                        DialogName: "ProcessStatusDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserGroup:
                    config = {
                        DialogName: "UserGroupDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserRole:
                    config = {
                        DialogName: "UserRoleDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Correspondence:
                case MasterId.Announcements:
                case MasterId.Circulars:
                case MasterId.Resolutions:
                case MasterId.Communications:
                case MasterId.Events:
                case MasterId.Requests:
                case MasterId.Meetings:
                case MasterId.Communication:
                case MasterId.NoticeBoardDesign:
                    config = {
                        DialogName: "CorrespondenceViewDialog", // Need to change this Component To View
                        FullWidth: false,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.RecurringTask:
                    config = {
                        DialogName: "RecurringTaskBrowse",
                        FullWidth: false,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break
                case MasterId.Tasks:
                    if (rowData?.TRANS_SUB_TYPE_ === TaskType.taskContactUpdate && userType === UserType.Franchise) {
                        config = {
                            DialogName: "TaskContactUpdatePopup",
                            FullWidth: false,
                            MaxWidth: "xl",
                            DialogHeading: DialogHeading(masterDetails, actionMenu),
                            IsFullPage: false,
                            action: actionMenu,
                            MasterId: masterDetails.MASTER_ID
                        };
                    } else {
                        config = {
                            DialogName: "CorrespondenceTaskViewDialog", // Need to change this Component To View
                            FullWidth: false,
                            MaxWidth: "xl",
                            DialogHeading: DialogHeading(masterDetails, actionMenu),
                            IsFullPage: true,
                            action: actionMenu,
                            MasterId: masterDetails.MASTER_ID
                        };
                    }
                    break;
                case MasterId.UserID:
                    config = {
                        DialogName: "UserDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Gallery:
                    config = {
                        DialogName: "GalleryDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.Contact:

                    config = {
                        DialogName: "ContactFormDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.OperatorRegistrationRequests:
                    config = {
                        DialogName: "OperatorRegistrationViewDialog",
                        FullWidth: true,
                        MaxWidth: "l",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                case MasterId.UserCreationRequest:
                case MasterId.UserRemovalRequest:
                case MasterId.UserModificationRequest:
                    config = {
                        DialogName: "UserCreationRequestDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    }
                    break;
                case MasterId.Mailtemplate:
                    config = {
                        DialogName: "MailtemplateDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
            }
            break;
        case MenuId.ChangeStatus:
            switch (masterDetails.MASTER_ID) {
                case MasterId.UserCreationRequest:
                case MasterId.UserRemovalRequest:
                case MasterId.UserModificationRequest:
                    config = {
                        DialogName: "UserCreationRequestDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    }
                    break;
            }

            break;
        case MenuId.ToggleActiveStatus:
            config = {
                DialogName: "ToggleActiveStatus",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: DialogHeading(masterDetails, actionMenu),
                IsFullPage: false,
                action: actionMenu,
                MasterId: masterDetails.MASTER_ID
            };
            break;
        case MenuId.ResetPassword:
            config = {
                DialogName: "UserResetPassword",
                FullWidth: false,
                MaxWidth: "md",
                DialogHeading: DialogHeading(masterDetails, actionMenu),
                IsFullPage: false,
                action: actionMenu,
                MasterId: masterDetails.MASTER_ID
            };
            break;
        case MenuId.CloseTransaction:
        case MenuId.Unpublish:
        case MenuId.UnpublishModification:
            switch (masterDetails.MASTER_ID) {
                case MasterId.Gallery:
                    config = {
                        DialogName: "GalleryDialog",
                        FullWidth: true,
                        MaxWidth: "md",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: false,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
                default:
                    config = {
                        DialogName: "CorrespondenceViewDialog", // Need to change this Component To View
                        FullWidth: false,
                        MaxWidth: "xl",
                        DialogHeading: DialogHeading(masterDetails, actionMenu),
                        IsFullPage: true,
                        action: actionMenu,
                        MasterId: masterDetails.MASTER_ID
                    };
                    break;
            }

            break;

        default:
            config = {};
            break;
    }
    return config;
};


export const popupComponentMenu = (menu: any) => {
    let config = {};

    switch (menu.MenuId) {
        case MenuId.MailRolesForm:
            config = {
                DialogName: "MailRolesDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu,
                MasterId: ""
            };
            break;
        case MenuId.MailRecordsForm:
            config = {
                DialogName: "MailRecordsDialog",
                FullWidth: true,
                MaxWidth: "xl",
                DialogHeading: menu?.MenuName,
                IsFullPage: true,
                action: menu,
                MasterId: ""
            };
            break;
        case MenuId.ServiceTypeApprovalEscalationRoles:
            config = {
                DialogName: "ApprovalEscalationDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu,
                MasterId: ""
            };
            break;
        case MenuId.MasterWorkflows:
            config = {
                DialogName: "MasterWorkFlowDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu
            };
            break;
        case MenuId.ApplicationSettings:
            config = {
                DialogName: "ApplicationSettingsDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu,
                MasterId: ""
            };
            break;
        case MenuId.ServiceTypeApprovalEscalationPeriod:
            config = {
                DialogName: "ApprovalEscalationPeriodDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu,
                MasterId: ""
            };
            break;
        case MenuId.ConfigureTransactionApproval:
            config = {
                DialogName: "ConfigureTransactionOwnershipDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu,
                MasterId: ""
            };
            break;
        case MenuId.Localization:
            config = {
                DialogName: "LocalizationDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu,
                MasterId: ""
            };
            break;
        case MenuId.EmailTemplate:
            config = {
                DialogName: "SetEmailTemplateDialog",
                FullWidth: true,
                MaxWidth: "lg",
                DialogHeading: menu?.MenuName,
                IsFullPage: false,
                action: menu,
                MasterId: ""
            };
            break;
        default:
            config = {};
            break;
    }
    return config;
}


export const actionQueuePopup = (rowData: any) => {
    let config = {};
    const userData = localStore.getLoggedInfo();
    const userType = userData && JSON.parse(userData).USER_TYPE;
    switch (rowData.MASTER_ID) {
        case MasterId.Tasks:
            if (rowData?.TRANS_SUB_TYPE_ === TaskType.taskContactUpdate && userType === UserType.Franchise) {
                config = {
                    DialogName: "TaskContactUpdatePopup",
                    FullWidth: false,
                    MaxWidth: "xl",
                    DialogHeading: '', //DialogHeading(masterDetails, actionMenu),
                    IsFullPage: false,
                    action: '',//actionMenu,
                    MasterId: '',//masterDetails.MASTER_ID
                    isPopup: true,
                    isActionQueue: true
                };
            } else {
                config = {
                    DialogName: "CorrespondenceTaskViewDialog", // Need to change this Component To View
                    FullWidth: false,
                    MaxWidth: "xl",
                    DialogHeading: '',//DialogHeading(masterDetails, actionMenu),
                    IsFullPage: true,
                    action: '',//actionMenu,
                    MasterId: '',//masterDetails.MASTER_ID
                    isPopup: true,
                    isActionQueue: true
                };
            }
            break;
        case MasterId.Correspondence:
        case MasterId.Announcements:
        case MasterId.Circulars:
        case MasterId.Resolutions:
        case MasterId.Communications:
        case MasterId.Events:
        case MasterId.Requests:
        case MasterId.Meetings:
        case MasterId.NoticeBoardDesign:
            config = {
                DialogName: "CorrespondenceViewDialog", // Need to change this Component To View
                FullWidth: false,
                MaxWidth: "xl",
                DialogHeading: switchCorrespondenceHeader(rowData.MASTER_ID),
                IsFullPage: true,
                action: '',
                MasterId: rowData.MASTER_ID,
                isActionQueue: true
            };
            break;
        case MasterId.UserCreationRequest:
        case MasterId.UserRemovalRequest:
        case MasterId.UserModificationRequest:
            config = {
                DialogName: "UserCreationRequestDialog",
                FullWidth: true,
                MaxWidth: "md",
                DialogHeading: switchCorrespondenceHeader(rowData.MASTER_ID),
                IsFullPage: false,
                action: '',
                MasterId: rowData.MASTER_ID,
                isActionQueue: true
            };
            break;
        case MasterId.OperatorRegistrationRequests:
            config = {
                DialogName: "OperatorRegistrationViewDialog",
                FullWidth: true,
                MaxWidth: "l",
                DialogHeading: "Operator Registration Requests - Status Change",
                IsFullPage: false,
                action: rowData.MASTER_ID,
                MasterId: "",
                isActionQueue: true
            };
            break;
        default:
            config = {};
            break;
    }
    return config;
}


export const switchCorrespondenceHeader = (masterId: any) => {
    let header = {};
    switch (masterId) {
        case MasterId.Correspondence:
            header = "Correspondence"
            break;
        case MasterId.Announcements:
            header = "Announcements"
            break;
        case MasterId.Circulars:
            header = "Circulars"
            break;
        case MasterId.Resolutions:
            header = "Resolutions"
            break;
        case MasterId.Tasks:
            header = "Tasks"
            break;
        case MasterId.Events:
            header = "Events"
            break;
        case MasterId.Requests:
            header = "Requests"
            break;
        case MasterId.Meetings:
            header = "Meetings"
            break;
        case MasterId.Communication:
            header = "Communication"
            break;
        case MasterId.NoticeBoardDesign:
            header = "Notice Board"
            break;
        case MasterId.UserCreationRequest:
            header = "User Creation Request"
            break;
        case MasterId.UserModificationRequest:
            header = "User Modification Request"
            break;
        case MasterId.UserRemovalRequest:
            header = "User Removal Request"
            break;

        default:
            header = "Title";
            break;
    }
    return header;
}


const DialogHeading = (masterDetails: any, actionMenu: any) => {
    return masterDetails.MASTER_NAME + (actionMenu.MenuName ? ' - ' + actionMenu.MenuName : '');
}

