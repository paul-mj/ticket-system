import { createContext } from 'react';

interface IDataGridActionContext {   
    gridActionChangeEvent: (value: any) => void;
}

const DataGridActionContext = createContext<IDataGridActionContext>({ 
    gridActionChangeEvent: () => { },
});

export default DataGridActionContext;
