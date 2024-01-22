import {BackToTop} from "./ui/BackToTop";
import {DataGrid} from "./ui/DataGrid";

import {AlignType, ColumnType, convertDebtTypeToStr} from "./ui/DataGrid/types";
import {Server} from "./ui/DataGrid/server";

import './App.css';
import {compareDates, compareDebtTypes} from "./ui/DataGrid/sortUtil";

const headers = [
    {
        title: "מספר התיק",
        type: ColumnType.ID,
        sortable: true,
        alignment: AlignType.right,
        alwaysShow: true,
    },
    {
        title: "התיק נפתח בתאריך",
        type: ColumnType.Date,
        sortable: true,
        alignment: AlignType.center,
        compareFunc : compareDates,
    },
    {
        title: "סוג החוב",
        type: ColumnType.Custom,
        sortable: true,
        alignment: AlignType.center,
        compareFunc : compareDebtTypes,
        displayFunc: convertDebtTypeToStr,
        alwaysShow: true,
    },
    {
        title: "מועד החישוב האחרון",
        type: ColumnType.Date,
        sortable: true,
        alignment: AlignType.center,
        compareFunc : compareDates,
    },
    {
        title: "סכום",
        type: ColumnType.Money,
        sortable: true,
        alignment: AlignType.center,
        alwaysShow: true,
    },
    {
        title: "",
        type: ColumnType.Other,
        sortable: false,
    },
];

function App() {

    const serverData = Server.getRecords(0, 10);

    return (<div className="App">
        <DataGrid headers={headers} data = {serverData.records} numRecords={serverData.numRecords} initialViewSize={5} endlessView={false}/>
        <BackToTop smoothScroll showAtHeight={100}/>
    </div>);
}

export default App;
