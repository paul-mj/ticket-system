export type ModalType = {
    open: boolean,
    onClose: unknown,
    masterDet: MasterDetExtension,
}

export type MasterDetExtension = {
    masterID: Number,
    masterName: String
}

export type FormValues ={
    objParentID:any,
    objectEnum:any,
    objEnumBooolean:boolean,
    objObjectBoolean:boolean,
    objCode: string,
    objName: string;
    objNameArabic: string;
    shortName: string;
    remarks: string;
    Active: boolean,
    DedName?:string,
    subEntity?:any[],
    mailGroup?:'',
    subEntityName?:''
    UserRights?: []
}

export type ExtraValues =[{
    FieldCaption: string,
    FieldName: any,
    IsRequired:number
}]

export type enumDet = [{
    ENUM_ID: number,
    ENUM_NAME: string,
    ENUM_TEXT:string,
    ENUM_VALUE: number,
    IS_ACTIVE:number,
    IS_DEFAULT:number,
    REMARKS:string,
    SORT_ORDER:number
}]
export type objectDet = [{
    OBJECT_ID: number,
    OBJECT_NAME: string,
    IS_ACTIVE:number,
    OBJECT_CODE:string,
    OBJECT_TYPE:number,
    PARENT_ID:number
}]

export type CloseReason = 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick';

export type dedGrdList = [{
    ID: number | null,
    DedName: string | null,
}]

export type menuGroupTyp = [{
    Id : string ,
    IsChecked :boolean,
    IsMaster : number,
    MasterId: number,
    MasterMenuId: number | null,
    MenuId: number | null, 
    ParentId: number | null,
    SortOrder: number | null,
    TaskName : string | null,
    expanded: boolean
}]

export type RoleForm = {
    objRoleType: any,
    objName: string;
    objNameArabic: string;
    objFullGroup: any,
    shortName: string;
    remarks: string;
    Active:boolean;
}
export type UserGroupLoad = [{
    ID_: number,
    OBJECT_CODE: string,
    OBJECT_NAME: string,
    ROLE_TYPE:number
}]


export type MailGroupGridType= [
    {
      ENTRY_TYPE: number| null,
      ROLE_ID: any| null,
      USER_ID: any | null,
      CONTACT_ID: any | null,
      MAIL_GROUP_ID: any | null,
      MAIL_ID: any | null,
      TO_DELETE: any | null
    }
  ]

  export type MailGridType=[
    {
        ENTRY_TYPE: number| null,
        ENTRY_TYPE_NAME: string | null 
        OBJECT_VALUE: any,   
        OBJECT_NAME:any
    }
  ];
  export type ProcessFormValues ={
    objParentID:number | null,
    objectEnum:any,
    objEnumBooolean:boolean,
    objObjectBoolean:boolean,
    objName: string,
    actionName:string,
    objNameArabic: string,
    actionNameArabic: string,
    statusEmail: string,
    statusEmailArabic:string,
    shortName: string;
    remarks: string;
    rmkMandatory:boolean
};

export type getRole = [{
    ROLE_ID: number,
    ROLE_NAME: string
}];

export type BooleanFields =[{
    YesName: string,
    Yes: number   
}];
export type EntityGrid = [{
    ENTITY_ID: number,
    ENTITY_NAME: string,
    IS_APPLICABLE: boolean,
    IS_APPLICABLE_NAME : string,
    IS_MANDATORY: boolean,
    IS_MANDATORY_NAME: string
}];

export type WorkFlowGrid = [{
    SORT_ORDER: number,
    ROLE_ID: number| null,
    ROLE_ID_1: number | null,
    ROLE_ID_2: number | null,
    FROM_STATUS_ID: number | null,
    TO_STATUS_ID: number | null,
    IS_FINAL: boolean,
    TO_DELETE: boolean
}]

export type DedCodeType = {dedCode: string,            
errors: {
    dedCode: String|null,                
}
}

export type DedCodeList = [{dedCode: string,            
    errors: {
        dedCode: String|null,                
    }
    }]

export type UserFormUser ={
    UserForm: {
        code: string,
        EntityAccessType: any,
        UserName: string,
        FullNameAr: string,
        FullName: string,
        Password: string,
        ConfirmPassword: string,
        IsPwdExpires: boolean,
        PwdExpireDays: number,
        PwdExprireDate: any,
        ChangePwd: boolean,
        MobileNo: string,
        MailID: string,
        Remarks: string,
        PublishLayout: boolean,
        UserType: number,
        FranchiseID?: any,
        RoleType?: string,
    },
}