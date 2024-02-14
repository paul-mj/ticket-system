class ReportUtils {
    static dbVariablesMap = new Map([
        ['@USER_ID', 'UserId'],
        ['@FRANCHISE_ID', 'FranchiseId'],
        ['@MASTER_ID', 'MASTER_ID'],
    ]);
    static getFormKeyFromParam(paramKey: string) {
        return paramKey.replace('@', '');
    }
    static openWindow(url: string, self?: boolean, data?: any): void {
        const target = self ? '_self' : '_blank';
        const trigger = window.open(url, target);
        trigger?.sessionStorage.setItem('data', data);
        trigger?.addEventListener('message', (e: any) => {
            // this.subject.windowMessage = e.data;
        }, false);
    }
    static getSessionData(key = 'data') {
        let parsedData = null;
        const sessionData = sessionStorage.getItem(key);
        try {
            parsedData = sessionData ? JSON.parse(sessionData) : null
        } catch (error) {

        }
        return parsedData;
    }
    static getSessionDataByKey(storeKey: string, paramKey: string) {
        const store = this.getSessionData(storeKey);
        return store ? store[paramKey] : undefined
    }
    static setSessionData(storeKey: string, paramKey: string, data: any) {
        const store = this.getSessionData(storeKey);
        if (store) {
            const newStore = {
                ...store,
                [paramKey]: data
            }
            sessionStorage.setItem(storeKey, JSON.stringify(newStore))
        }
    }
    static getDBVariable({ userInfo, dbVariables, pageDetails }: any) {
        return dbVariables.map((dbVar: any) => {
            const repo = {
                ...userInfo,
                ...pageDetails
            }
            const key = this.dbVariablesMap.get(dbVar.ParamName);
            const { DisplayFormat, EditorType, ParamName, UserIdRequired, RoleIdRequired, DbType } = dbVar;
            return {
                DisplayFormat,
                EditorType,
                ParamName,
                UserIdRequired,
                RoleIdRequired,
                DbType,
                Value: key ? repo[key] : null
            }
        })
    }
    static formatParamsForAPI(criteria: any[], filterData: any[]) {
        const criteriaList: any[] = []
        criteria.forEach((element: any) => {
            const crKey = this.getFormKeyFromParam(element.ParamName);
            let Value = filterData[crKey];
            switch (element.EditorType) {
                case 1:
                    Value = Number(filterData[crKey])
                    break;

                default:
                    break;
            }
            if (filterData[crKey]) {
                const { DisplayFormat, EditorType, ParamName, UserIdRequired, RoleIdRequired, DbType } = element;
                const criteriaItem = {
                    DisplayFormat,
                    EditorType,
                    ParamName,
                    UserIdRequired,
                    RoleIdRequired,
                    DbType,
                    Value
                }
                criteriaList.push(criteriaItem)
            }
        });
        return criteriaList;
    }
    static get defaultGridProps(): any[] {
        return [
            {
                Name: 'headerFilter.visible',
                Description: 'Header Filter',
                Value: false,
            },
            { Name: 'filterPanel.visible', Description: 'Filter Panel', Value: true },
            { Name: 'filterRow.visible', Description: 'Filter Row', Value: true },
            { Name: 'groupPanel.visible', Description: 'Group Panel', Value: false },
            { Name: 'showColumnLines', Description: 'Column Lines', Value: false },
            { Name: 'showRowLines', Description: 'Row Lines', Value: true },
            { Name: 'allowColumnResizing', Description: 'Allow Column Resizing', Value: false },
            {
                Name: 'filterRow.showOperationChooser',
                Description: 'Operation Chooser',
                Value: false,
            }
        ];
    }
    static get defaultPivotProps(): any[] {
        return [
            { Name: 'allowFiltering', Description: 'Filtering', Value: true },
            { Name: 'allowExpandAll', Description: 'Expand All', Value: true },
            { Name: 'allowSorting', Description: 'Sorting', Value: false },
            {
                Name: 'allowSortingBySummary',
                Description: 'Sorting By Summary',
                Value: true,
            },
            {
                Name: 'showColumnGrandTotals',
                Description: 'Column Grand Total',
                Value: true,
            },
            { Name: 'showColumnTotals', Description: 'Column Totals', Value: false },
            {
                Name: 'showRowGrandTotals',
                Description: 'Row Grand Totals',
                Value: true,
            },
            { Name: 'showRowTotals', Description: 'Row Totals', Value: true },
            {
                Name: 'hideEmptySummaryCells',
                Description: 'Hide Empty Summary Cells',
                Value: true,
            },
            {
                Name: 'wordWrapEnabled',
                Description: 'WordWrap Enabled',
                Value: false,
            },
        ];
    }
    static updateObject(object: any, newValue: any, path: string) {
        var stack: any = path.split('.');
        while (stack.length > 1) {
            object = object[stack.shift()];
        }
        object[stack.shift()] = newValue;
    }
    static getObject(object: any, path: string) {
        let value;
        var stack: any = path.split('.');
        while (stack.length > 1) {
            value = object[stack.shift()]
        }
        return value;
    }
    static createObject(newValue: any, path: string, repo: any) {
        const dir = {}
        const paths = path.split('.');
        paths.reduce(function (dir, path, index) {
            const oldVal = repo[path];
            const res = (index === paths.length - 1 ? newValue : oldVal ? oldVal : {});
            dir[path] = res;
            return dir[path]
        }, dir);
        return dir;
    }
    static onRowPreparedHandler(event: any) {
        const { rowType, data, rowElement } = event
        if (rowType === 'data') {
          const { style } = data;
          const { children } = rowElement;
          if (style) {
            for (const key in style) {
              if (Object.prototype.hasOwnProperty.call(style, key)) {
                const element = style[key];
                const { F_COLOR, B_COLOR, IS_FULL_ROW } = element;
                if (IS_FULL_ROW) {
                  for (const key in children) {
                    if (Object.prototype.hasOwnProperty.call(children, key)) {
                      const childElement = children[key];
                      const isFirstCol = childElement.attributes['aria-colindex'].value === '1';
                      if (!isFirstCol) {
                        childElement.style.background = B_COLOR;
                        childElement.style.color = F_COLOR;
                      }
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      }
      static onCellPreparedHandler(event: any): void {
        const { rowType, column: { dataField }, data, cellElement } = event;
        const { style } = data ?? {};
        if (rowType === 'data') {
          if (style) {
            if (style[dataField]) {
              const { F_COLOR, B_COLOR } = style[dataField];
              cellElement.style.background = B_COLOR;
              cellElement.style.color = F_COLOR;
            }
          }
        }
      }
      static buildRules(value: any) {
        function trigger(ARG: any, dataField:string, conditon:string) {
          return eval(conditon);
        }
        const { Data, FormatRules } = value;
        (FormatRules ?? []).forEach((rule: any) => {
          Data.forEach((row: any) => {
            for (const key in row) {
              if (Object.prototype.hasOwnProperty.call(row, key)) {
                if (key === rule.COLUMN_NAME) {
                  const { ARG, CONDITION } = rule;
                  const result = trigger(ARG, row[key], CONDITION);
                  if (result) {
                    row.style = {
                      ...row.style ?? {},
                      [key]: rule
                    }
                  }
                }
              }
            }
          })
        })
      }    
}
export default ReportUtils;