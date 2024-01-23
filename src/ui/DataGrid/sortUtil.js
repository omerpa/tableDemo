import {DebtType} from "./types";

let sortBy = 0;
let compareByFunc = undefined;
let flipSort = false;
const strToDate = date => {
    const pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const arrayDate = date.match(pattern);
    return new Date(arrayDate[3], arrayDate[2] - 1, arrayDate[1]);
}
const compareDates = (d1, d2) => {
    const date1 = strToDate(d1[sortBy]);
    const date2 = strToDate(d2[sortBy]);

    if (date1 < date2) {
        return flipSort ? 1 : -1;
    } else if (date1 > date2) {
        return flipSort ? -1 : 1;
    } else {
        return 0;
    }
};
const compareDebtTypes = (itemA, itemB) => {

    const debtType1 =  itemA[sortBy];
    const debtType2 =  itemB[sortBy];

    let compareRes = 0;
    if (debtType1 !== debtType2) {

        switch (debtType1) {
            case DebtType.Traffic:
                compareRes = flipSort ? -1 : 1;
                break;

            case DebtType.Legal:
                compareRes = flipSort ? 1 : -1;
                break;

            case DebtType.Tax:
                if(debtType2 === DebtType.Traffic) {
                    compareRes = flipSort ? 1 : -1;
                }
                else {
                    compareRes = flipSort ? -1 : 1;
                }
                break;

            default:
                console.warn("Debt type not found");
        }
    }

    return compareRes;
};

const sortFunc = (itemA, itemB) => {
    let compareRes;
    if (compareByFunc) {
        compareRes = compareByFunc(itemA, itemB);
    } else {
        if (itemA[sortBy] > itemB[sortBy]) {
            compareRes = flipSort ? -1 : 1;
        } else {
            compareRes = flipSort ? 1 : -1;
        }
    }

    return compareRes;
}
const sortData = (data, sortIndex, shouldFlip, compareFunc) => {
    const sortedArray = [...data];
    sortBy = sortIndex;
    flipSort = shouldFlip;
    compareByFunc = compareFunc;

    sortedArray.sort(sortFunc);

    return sortedArray;
}

export {sortData, compareDebtTypes, compareDates};