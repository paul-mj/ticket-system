export const API = Object.freeze({
    getModules: 'data/getModules',
    getMasters: 'data/getMasters',
    getMasterSubMenu: 'data/readMasterMenus',
    getMasterDetail: 'data/getMasterDetail',
    getEnums: 'lookup/getEnums',
    getObjects: 'lookup/getObjects',
    getTable: 'data/getTable',
    writeDoc: 'file/writeDoc',
    masters: {
        getStatusLookups: 'processstatus/getStatusLookups',
        getreadRoles: 'mailgroups/getRoleLookups',
        getExtraInfo: 'objects/getExtraInfo'
    },
    transaction: {
        read:'trans/read',
        save:'trans/save',
        getOperators:'trans/getOperators',
        lookupTags:'trans/lookupTags',
        lookupRelatedItems:'trans/lookupRelatedItems',
        getRecipients:'trans/getRecipients',
        readUserActions:'trans/readUserActions',
    },
    chat: {
        connection: 'hubs/chat'
    }
});
