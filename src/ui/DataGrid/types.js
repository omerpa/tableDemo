const ColumnType = {
    ID: 0,
    Date: 1,
    String: 2,
    Number: 3,
    Money: 4,
    Custom: 5,
    Other: 6,
};

const AlignType = {
    right: 0,
    center: 1,
    left: 2,
};
const DebtType = {
    Traffic: 0,
    Legal: 1,
    Tax: 2,
}

const convertDebtTypeToStr = debtType => {
    let retStr = "";
    switch (debtType) {
        case DebtType.Traffic:
            retStr = "תעבורה";
            break;

        case DebtType.Legal:
            retStr = "משפטים";
            break;

        case DebtType.Tax:
            retStr = "מיסים";
            break;

        default:
            console.warn("סוג חוב לא ידוע");
    }

    return retStr;
}

const numberWithCommas = number => {

    let retNumber;
    if (number === 0) {
        retNumber = number;
    } else {
        retNumber = number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
    }

    return retNumber;
};

export {AlignType, ColumnType, DebtType, convertDebtTypeToStr, numberWithCommas};