class TreeUtils {
    static markCheckedInitial = (list: any[], selectedList: any[], level: number): any[] => {
        let isSomeChildChecked = false;
        let isEveryChildChecked = false;
        let isIndeterminate = false;
        return list.map((item: any) => {
            const isMarked = selectedList.includes(item.id);
            if (item.items?.length) {
                item.items = this.markCheckedInitial(item.items, selectedList, level + 1);
                isSomeChildChecked = item.items.some((child: any) => child.isMarked);
                isEveryChildChecked = item.items.every((child: any) => child.isMarked);
                isIndeterminate = item.items.some((child: any) => child.indeterminate);
            }
            const indeterminate = (isEveryChildChecked ? false : isSomeChildChecked) || isIndeterminate;
            return {
                ...item,
                level,
                isMarked: isMarked || isSomeChildChecked,
                allowToShow: item.allowToShow ?? true,
                indeterminate,
                isSomeChildChecked,
                isEveryChildChecked
            }

        })
    }
    static markAllasChecked = (list: any[], mode: boolean, search = '') => {
        const isSame = (search: string, target: string) => {
            return target.toUpperCase().includes(search.toUpperCase())
        }

        return list.map((item: any) => {
            if (item.items?.length) {
                item.items = this.markAllasChecked(item.items, mode, search);
            }
            const partialSelect = (!!search && mode);
            return {
                ...item,
                isMarked: partialSelect ? isSame(search, item.text) : mode
                // isMarked: mode // Normal select all without search check
            }
        })
    }
    static getNode = (list: any[], id: number): any => {
        let result;
        list.forEach((f: any) => {
            if (f.id === id) {
                result = f;
            } else {
                if (f?.items) {
                    const found = this.getNode(f.items, id);
                    if (found) {
                        result = found;
                    }
                }
            }
        })
        return result;
    }
    static getMarkedNode = (list: any[], level?: number) => {
        const markedList: any[] = [];
        list.forEach((item: any) => {
            if (item.isMarked) {
                markedList.push(item)
            }
            if (item.items) {
                const childList = this.getMarkedNode(item.items, level);
                markedList.push(...childList);
            }
        })
        return level ? markedList.filter((itm: any) => itm.level === level) : markedList;
    }
    static getSelectedNode = (list: any[], selected: any[]) => {
        const markedList: any[] = [];
        list.forEach((item: any) => {
            if (selected.includes(item.id) && item.isLeaf) {
                markedList.push(item)
            }
            if (item.items) {
                const childList = this.getSelectedNode(item.items, selected);
                markedList.push(...childList);
            }
        })
        return markedList;
    }
    static getLeafNodes = (list: any[]) => {
        const leafNodes: any[] = [];
        list.forEach((item: any) => {
            if (item.isLeaf) {
                leafNodes.push(item)
            }
            if (item.items) {
                const childList = this.getLeafNodes(item.items);
                leafNodes.push(...childList);
            }
        })
        return leafNodes;
    }
    static searchNode = (list: any[], search: string = '') => {
        const temp = [...list]
        temp.forEach((item: any) => {
            const { text, items = [] } = item;
            const hasWord = text.toUpperCase().includes(search.toUpperCase());
            item.allowToShow = !!search ? hasWord : true;
            if (items?.length) {
                this.searchNode(items, search)
                const isAllowed = items.some((item: any) => item.allowToShow);
                item.allowToShow = !!search ? hasWord || isAllowed : true;
            }
        })
        return temp;
    }
    static JSONParse(json: string): any {
        let result;
        try {
            result = JSON.parse(json)
        } catch (error) {
            result = {}
        }
        return result;
    }
    static JSONStringify(obj: any): string {
        let result;
        try {
            result = JSON.stringify(obj)
        } catch (error) {
            result = ''
        }
        return result;
    }
}
export default TreeUtils;