export function copyJson(original: any): any {
    const copy = Object.assign({}, original);
    delete copy.created_at;
    delete copy.updated_at;
    delete copy.id;
    return copy;
}

export function getFilterPredicate() {
    return (data: any, filter) => {
        const dataStr = JSON.stringify(data).toLowerCase();
        return dataStr.indexOf(filter) !== -1;
    };
}

export function includeArray(array: any[], object: any): boolean {
    const result = array.find(x => x.id === object.id);
    return typeof result !== 'undefined';
}

export function in_array(array: any[], key): boolean {
    const result = array.find(x => x === key);
    return typeof result !== 'undefined';
}


export function removeItemFromArr(arr, item) {
    const i = arr.indexOf(item);
    if (i !== -1) {
        arr.splice(i, 1);
    }
}

export function removeItemFromArrById(arr: any[], item) {
    const i = arr.findIndex( element => item.id === element.id);
    if (i !== -1) {
        arr.splice(i, 1);
    }
}

export function countArray(array: any[], search: string) {
    let count = 0;
    for (const element of array) {
        if (search === element) {
            count++;
        }
    }
    return count;
}
