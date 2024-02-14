import ApiService from "../../core/services/axios/api";

export async function readObjInfo(Value:any)
{
    const responseMasterList = await ApiService.httpPost('objects/getExtraInfo',Value);
    return responseMasterList;   
};
export async function readEnums(Value:any)
{
    const responseMasterList = await ApiService.httpPost('lookup/getEnums',Value);
    return responseMasterList;
};

export async function saveObject(Value:any)
{
    const responseMasterList = await ApiService.httpPost('objects/save',Value);
    return responseMasterList;
};

export async function readObjectValue(Value:any)
{
    const responseMasterList = await ApiService.httpPost('lookup/getObjects',Value);
    return responseMasterList;
};

export async function saveSubEntities(Value:any)
{
    const responseMasterList = await ApiService.httpPost('subentities/save',Value);
    return responseMasterList;
};

export async function readUserRights(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/readRights',Value);
    return responseMasterList;
};

export async function saveUserGroup(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/saveGroup',Value);
    return responseMasterList;
};

export async function  readGroupLookup(Value:any){
    const url = `roles/getGroupLookups?cultureId=${Value}`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;   
};

export async function saveUserRole(Value:any)
{
    const responseMasterList = await ApiService.httpPost('roles/save',Value);
    return responseMasterList;
};


export async function readRole(Value:any)
{
    const url = `roles/read?roleId=${Value}`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;
};



export async function getRoles(Value:any)
{
    const responseMasterList = await ApiService.httpPost('mailgroups/getRoleLookups',Value);
    return responseMasterList;
};

export async function saveProcessStatus(Value:any)
{
    const responseMasterList = await ApiService.httpPost('processstatus/save',Value);
    return responseMasterList;
};

export async function saveDesignation(Value:any)
{
    const responseMasterList = await ApiService.httpPost('designations/save',Value);
    return responseMasterList;
};

export async function getProcessStatus(Value:any)
{
    const responseMasterList = await ApiService.httpPost('processstatus/getStatusLookups',Value);
    return responseMasterList;
};

export async function saveWorkFlow(Value:any)
{
    const responseMasterList = await ApiService.httpPost('workflows/save',Value);
    return responseMasterList;
};

export async function getMailGroup(Value:any)
{
    const responseMasterList = await ApiService.httpPost('mailgroups/getMailGroupLookups',Value);
    return responseMasterList;
};

export async function getUserMailGroup(Value:any)
{
    const responseMasterList = await ApiService.httpPost('mailgroups/getUserLookups',Value);
    return responseMasterList;
};

export async function getContactMailGroup(Value:any)
{
    const responseMasterList = await ApiService.httpPost('mailgroups/getContactLookups',Value);
    return responseMasterList;
};

export async function  readSubEntityValue(Value:any){
    const url = `subentities/read?id=${Value}`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;   
};

export async function readObjectData(Value:any)
{
    const responseMasterList = await ApiService.httpPost('objects/read',Value);
    return responseMasterList;
};

export async function readDesignation(Value:any)
{
    const responseMasterList = await ApiService.httpPost('designations/read',Value);
    return responseMasterList;
};
export async function  readProcessStatus(Value:any){
    const url = `processstatus/read?id=${Value}`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;   
};

export async function  readWorkFlow(Value:any){
    const url = `workflows/read?id=${Value}`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;   
};

export async function deleteObject(Value:any)
{
    const responseMasterList = await ApiService.httpPost('objects/delete',Value);
    return responseMasterList;
};

export async function  readRoles(Value:any){
    const url = `roles/read?roleId=${Value}`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;   
};

export async function  getApplicableGroupinRoles(Value:any){
    const url = `roles/getApplicableGroups?roleId=${Value}`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;   
};

export async function mailGroupSubEntities(Value:any)
{
    const responseMasterList = await ApiService.httpPost('mailgroups/getSubEntities',Value);
    return responseMasterList;
};

export async function mailgroupsSave(Value:any)
{
    const responseMasterList = await ApiService.httpPost('mailgroups/save',Value);
    return responseMasterList;
};

export async function readMailGroup(Value:any)
{
    const responseMasterList = await ApiService.httpPost('mailgroups/read',Value);
    return responseMasterList;
};

export async function usrGroupread(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/readGroup',Value);
    return responseMasterList;
};

export async function userGetRoles(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/getRoles',Value);
    return responseMasterList;
};

export async function userSubEntity(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/getSubEntities',Value);
    return responseMasterList;
};

export async function userGetUserRoles(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/getUserRoles',Value);
    return responseMasterList;
};
export async function userSave(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/save',Value);
    return responseMasterList;
};

export async function readUser(Value:any)
{
    const responseMasterList = await ApiService.httpPost('user/read',Value);
    return responseMasterList;
};

export async function saveSetting(Value:any)
{
    const responseMasterList = await ApiService.httpPost('data/saveSetting',Value);
    return responseMasterList;
};

export async function  readSetting(){
    const url = `data/readSetting`;
    const responseMasterList = await ApiService.httpGet(url);        
    return responseMasterList;   
};

export async function readContactSubEntity(Value:any)
{
    const responseMasterList = await ApiService.httpPost('contacts/readRights',Value);
    return responseMasterList;
};
export async function readContactDesignation(Value:any)
{
    const responseMasterList = await ApiService.httpPost('contacts/readDesignations',Value);
    return responseMasterList;
};

export async function saveContact(Value:any)
{
    const responseMasterList = await ApiService.httpPost('contacts/save',Value);
    return responseMasterList;
};

export async function readContact(Value:any)
{
    const responseMasterList = await ApiService.httpPost('contacts/read',Value);
    return responseMasterList;
};

