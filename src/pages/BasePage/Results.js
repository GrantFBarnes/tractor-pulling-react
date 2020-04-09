import React from "react";
import BasePage from "../BasePage";
import { DataTable } from "carbon-components-react";

const {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    TableToolbar,
    TableToolbarSearch,
    TableContainer
} = DataTable;

class Results extends BasePage {
    genResultsTable = hooks => {
        return (
            <DataTable
                rows={hooks}
                headers={[
                    { key: "position", header: "Pos" },
                    { key: "puller", header: "Puller" },
                    { key: "tractor", header: "Tractor" },
                    { key: "distance", header: "Distance" }
                ]}
                isSortable
                render={({ rows, headers, getHeaderProps, onInputChange }) => (
                    <TableContainer>
                        <TableToolbar>
                            <TableToolbarSearch onChange={onInputChange} />
                        </TableToolbar>
                        <Table>
                            <TableHead>
                                <tr>
                                    {headers.map(header => (
                                        <TableHeader
                                            {...getHeaderProps({
                                                header
                                            })}
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </tr>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.id}>
                                        {row.cells.map(cell => (
                                            <TableCell key={cell.id}>
                                                {cell.value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            />
        );
    };

    seasonSort = (a, b) => {
        if (a.year < b.year) return 1;
        if (a.year > b.year) return -1;
        return 0;
    };

    pullSort = (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    };

    classSort = (a, b) => {
        if (a.weight < b.weight) return -1;
        if (a.weight > b.weight) return 1;
        if (a.category < b.category) return 1;
        if (a.category > b.category) return -1;
        if (a.speed < b.speed) return -1;
        if (a.speed > b.speed) return 1;
        return 0;
    };

    hookSort = (a, b) => {
        if (a.position < b.position) return -1;
        if (a.position > b.position) return 1;
        return 0;
    };

    genSmallWinFilters = filtered => {
        let dropdowns = [];
        if (filtered.seasons.length) {
            dropdowns.push(
                <div key="seasonRow" className="contentRow">
                    {this.genSeasonDropdown(filtered)}
                </div>
            );
        }
        if (filtered.pulls.length) {
            dropdowns.push(
                <div key="pullRow" className="contentRow">
                    {this.genPullDropdown(filtered)}
                </div>
            );
        }
        if (filtered.classes.length) {
            dropdowns.push(
                <div key="classRow" className="contentRow">
                    {this.genClassDropdown(filtered)}
                </div>
            );
        }
        return dropdowns;
    };

    genLargeWinFilters = filtered => {
        return (
            <div className="contentRow">
                <div className="thirdColumn paddingRight">
                    {filtered.seasons.length
                        ? this.genSeasonDropdown(filtered)
                        : null}
                </div>
                <div className="thirdColumn paddingLeft paddingRight">
                    {filtered.pulls.length
                        ? this.genPullDropdown(filtered)
                        : null}
                </div>
                <div className="thirdColumn paddingLeft">
                    {filtered.classes.length
                        ? this.genClassDropdown(filtered)
                        : null}
                </div>
            </div>
        );
    };

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.state.smallWindow
                    ? this.genSmallWinFilters(filtered)
                    : this.genLargeWinFilters(filtered)}
                <div className="contentRow">
                    <div
                        className={
                            "tableContainer " +
                            (this.state.sideExpanded
                                ? "tableContainerSideExpanded"
                                : "tableContainerSideCollapsed")
                        }
                    >
                        {filtered.hooks.length ? (
                            this.genResultsTable(filtered.hooks)
                        ) : (
                            <div>
                                <br />
                                <p className="center">
                                    Please select a class from filters above to
                                    see results
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Results;
