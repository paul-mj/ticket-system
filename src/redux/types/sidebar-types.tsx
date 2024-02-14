/* Module Menu */
export type ModuleMenuParamType = {
    Id: Number;
    CultureId: Number;
};

export type ModuleMenuState = {
    loading: boolean,
    error: string | null;
    moduleMenus: [];
};

export const initialStateModule: ModuleMenuState = {
    loading: false,
    error: null,
    moduleMenus: []
};


/* Master Menu */
export type MasterMenuParams = {
    UserId: number,
    ModuleId: number,
    CultureId: number,
};

export type MasterMenuState = {
    loading: boolean,
    error: string | null;
    masterMenus: {};
};

export const initialStateMaster: MasterMenuState = {
    loading: false,
    error: null,
    masterMenus: {}
};



/* Masters Sub Menu */
export type MasterMenuSubParams = {
    UserId: number,
    MasterId: number,
    CultureId: number,
};

export type MasterMenuSubState = {
    loading: boolean,
    error: string | null;
    masterMenusSub: {};
};

export const initialStateMasterSub: MasterMenuSubState = {
    loading: false,
    error: null,
    masterMenusSub: {}
};




/* Master Details */
export type MasterDetailsParams = {
    UserId: number,
    MasterId: number,
    CultureId: number,
};

export type MasterDetailsState = {
    loading: boolean,
    error: string | null;
    masterDetails: [];
};

export const initialStateMasterDetails: MasterDetailsState = {
    loading: false,
    error: null,
    masterDetails: []
};


/* Master Details */
export type ActiveMasterDetailsParams = {
    UserId: number,
    MasterId: number,
    CultureId: number,
};

export type ActiveMasterDetailsState = {
    loading: boolean,
    error: string | null;
    activeDetails: {};
};

export const initialStateActiveMasterDetails: ActiveMasterDetailsState = {
    loading: false,
    error: null,
    activeDetails: {}
};


export const initialFilterState: any = {
    loading: false,
    error: null,
    filterCriteria: []
};







export interface MsterMenuItem {
    id: number;
    menu: any;
}

export interface MasterMenuListState {
    List: MsterMenuItem[];
    temporaryMenu: any;
}

export const initialMasterListState: MasterMenuListState = {
    List: [],
    temporaryMenu: null
};