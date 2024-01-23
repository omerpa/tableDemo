import React, {useState, useRef} from 'react';

import {AlignType, ColumnType, numberWithCommas} from "./types";
import {sortData} from "./sortUtil";
import {Server} from "./server";
import {Animations} from "../animations";
import {UseIsSmallScreen} from "../hooks/useIsSmallScreen";

import "./css/index.scss";

const DataGrid = ({headers, data, numRecords, initialViewSize, endlessView}) => {
    const [sortBy, setSortBy] = useState(0);
    const [flipSort, setFlipSort] = useState(false);
    const [sortedData, setSortedData] = useState(initialViewSize ? data.slice(initialViewSize) : [...data]);
    const [showMore, setShowMore] = useState(initialViewSize !== undefined);
    const [partialViewIndex, setPartialViewIndex] = useState(0);
    const [dataGridKey, setDataGridKey] = useState(0);
    const [expandedRowUniqueId, setExpandedRowUniqueId] = useState(0);

    const UpArrow = "\u25BC";
    const DownArrow = "\u25B2";
    const DownTriangle = "\u25BC";
    const UpTriangle = "\u25B2";
    const LeftArrow = "\u2190";
    const RightArrow = "\u2192";
    const PartialViewSize = 10;

    const navigationTiming = {
        duration: 500,
        iterations: 1,
    };

    const isSmallScreen = UseIsSmallScreen(500);
    const tableRef = useRef(null);

    const handleScroll = () => {
        if (hasMoreRecords) {
            if (tableRef.current.offsetHeight + tableRef.current.scrollTop >= tableRef.current.scrollHeight) {
                const moreData = [...sortedData, ...Server.getRecords(sortedData.length, 10).records];
                const newSortedData = sortData(moreData, sortBy, flipSort, headers[sortBy].compareFunc);
                setSortedData(newSortedData);
            }
        }
    }

    if (endlessView && tableRef.current) {
        tableRef.current.addEventListener("scroll", handleScroll);
    }

    const hasMoreRecords = () => {
        if (endlessView) {
            return numRecords > sortedData.length;
        }

        return numRecords > (partialViewIndex + PartialViewSize);
    }

    const onSort = index => {
        let flip = false;
        if (index === sortBy) {
            flip = !flipSort;
        } else {
            setSortBy(index);
        }

        setFlipSort(flip);

        setSortedData(sortData(sortedData, index, flip, headers[index].compareFunc));
    };

    const getAlignment = header => {

        let retAlign;

        switch (header.alignment) {
            case AlignType.right:
                retAlign = "alignRight";
                break;

            case AlignType.left:
                retAlign = "alignLeft";
                break;

            case AlignType.center:
                retAlign = "alignCenter";
                break;

            default:
                retAlign = "center";
                break;
        }

        return retAlign;
    };

    const buildHeader = () => <tr>
        {headers.map((header, index) => {
            const showColumn = !isSmallScreen || header.alwaysShow;
            const arrowType = flipSort ? DownArrow : UpArrow;
            const headerTitle = `${header.title} ${index === sortBy ? arrowType : ""}`;
            return showColumn ? <th key={index + 999999}
                                    className={`${getAlignment(header)} ${header.sortable ? "sortableHeader" : ""}`}
                                    onClick={() => onSort(index)}>
                {headerTitle}</th> : "";
        })}
    </tr>;

    const selectRow = index => {
        sortedData[index].selected = !sortedData[index].selected;
        setDataGridKey(dataGridKey + 1);
    }

    const openExpander = (index, uniqueId) => {
        if (expandedRowUniqueId === uniqueId) {
            setExpandedRowUniqueId(0);
        } else {
            setExpandedRowUniqueId(uniqueId);
        }
    }
    const populateData = () => sortedData.map((item, index) => {

        const uniqueId = item[0];
        const numColumns = headers.length;

        return <>
            <tr className={sortedData[index].selected ? "selectedRow" : ""} key={uniqueId}
                onClick={() => selectRow(index)}>
                {item.map((itemData, headerIndex) => {
                    const header = headers[headerIndex];
                    const showColumn = !isSmallScreen || header.alwaysShow;

                    if (showColumn) {
                        const shouldAddCommas = header.type === ColumnType.Money;
                        let displayData = header.displayFunc ? header.displayFunc(itemData) : itemData;
                        if (headerIndex === 0) {
                            displayData = <p>
                                <span onClick={event => {
                                    event.stopPropagation();
                                    openExpander(index, uniqueId)
                                }
                                }>
                                {(expandedRowUniqueId !== uniqueId) ? DownTriangle : UpTriangle}
                            </span> {displayData}
                            </p>;
                        }
                        return <td key={headerIndex + uniqueId + 1}
                                   className={getAlignment(header)}>
                            {shouldAddCommas ? `\u20AA${numberWithCommas(displayData)}` : displayData}
                        </td>
                    } else {
                        return "";
                    }

                })}
            </tr>
            <tr className={(expandedRowUniqueId === uniqueId) ? "showRow" : "hideRow"} id={uniqueId}
                key={Math.pow(uniqueId, 2)}>
                <td colSpan={numColumns}><img className="expandDemoImg"
                                              src="https://static.wixstatic.com/media/da3fd9_7070a699f8034c0f8f2131b38f5661e6~mv2.jpg"/>
                </td>
            </tr>
        </>
    });

    const cancelPartialView = () => {
        const wholeView = [...data];

        setSortedData([...sortData(wholeView, sortBy, flipSort, headers[sortBy].compareFunc)]);

        setShowMore(false);
    };

    const showNextPage = () => {
        const nextData = [...Server.getRecords(partialViewIndex + PartialViewSize, PartialViewSize).records];
        const newSortedData = sortData(nextData, sortBy, flipSort, headers[sortBy].compareFunc);

        setPartialViewIndex(partialViewIndex + PartialViewSize);
        setSortedData(newSortedData);

        tableRef.current.animate(Animations.forward, navigationTiming);
    };

    const showPrevPage = () => {
        const nextData = [...Server.getRecords(partialViewIndex - PartialViewSize, PartialViewSize).records];
        const newSortedData = sortData(nextData, sortBy, flipSort, headers[sortBy].compareFunc);

        setPartialViewIndex(partialViewIndex - PartialViewSize);
        setSortedData(newSortedData);

        tableRef.current.animate(Animations.backward, navigationTiming);
    };

    return <div className={`DataGrid ${!showMore && endlessView ? "DataGrid--endless" : ""}`} ref={tableRef}
                key={dataGridKey}>
        <table>
            <tbody>
            {buildHeader()}
            {populateData()}
            </tbody>
        </table>
        {showMore &&
            <div onClick={cancelPartialView}><p className="showMoreLink">לכל התיקים<span>  {DownTriangle}</span></p>
            </div>}
        {!showMore && !endlessView &&
            <div className="navigationFooter">
                {(partialViewIndex !== 0) && <p onClick={showPrevPage}>{`${RightArrow} לדף הקודם `}</p>}
                {hasMoreRecords() && <p onClick={showNextPage}>{`לדף הבא ${LeftArrow}`}</p>}
            </div>}
    </div>
}

export {DataGrid}