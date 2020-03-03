import React from "react";
import BasePage from "../BasePage";
import { Button, Dropdown, DataTable } from "carbon-components-react";

import Add20 from "@carbon/icons-react/lib/add/20";

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

class Edit extends BasePage {
    constructor() {
        super();
        this.state.objectType = "";
        this.state.objectTypeOptions = [
            { id: "season", display: "Seasons" },
            { id: "pull", display: "Pulls" },
            { id: "hook", display: "Hooks" },
            { id: "tractor", display: "Tractor" },
            { id: "puller", display: "Pullers" },
            { id: "class", display: "Classes" }
        ];

        this.state.rows = [];
    }

    addNew = () => {
        console.log(this.state.objectType);
    };

    getHeaders = () => {
        let headers = [{ key: "delete", header: "Delete" }];
        switch (this.state.objectType) {
            case "season":
                headers.push({ key: "year", header: "Year" });
                break;
            case "hook":
                headers.push({ key: "class", header: "Class" });
                headers.push({ key: "position", header: "Position" });
                headers.push({ key: "name", header: "Name" });
                headers.push({ key: "tractor", header: "Tractor" });
                headers.push({ key: "distance", header: "Distance" });
                break;
            case "tractor":
                headers.push({ key: "owner", header: "Owner" });
                headers.push({ key: "brand", header: "Brand" });
                headers.push({ key: "model", header: "Model" });
                break;
            case "puller":
                headers.push({ key: "first_name", header: "First" });
                headers.push({ key: "last_name", header: "Last" });
                headers.push({ key: "position", header: "Position" });
                headers.push({ key: "member", header: "Member" });
                break;
            case "class":
                headers.push({ key: "pull", header: "Pull" });
                headers.push({ key: "category", header: "Category" });
                headers.push({ key: "weight", header: "Weight" });
                headers.push({ key: "speed", header: "Speed" });
                break;
            case "pull":
                headers.push({ key: "season", header: "Season" });
                headers.push({ key: "location", header: "Location" });
                headers.push({ key: "date", header: "Date" });
                headers.push({ key: "hour", header: "Hour" });
                headers.push({ key: "minute", header: "Minute" });
                headers.push({ key: "meridiem", header: "Meridiem" });
                headers.push({ key: "notes", header: "Notes" });
                headers.push({ key: "blacktop", header: "Blacktop" });
                break;
            default:
                break;
        }
        return headers;
    };

    genEditTable = () => {
        if (!this.state.objectType) return null;
        const headers = this.getHeaders();
        return (
            <DataTable
                rows={this.state.rows}
                headers={headers}
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

    contentRender() {
        if (!this.state.canEdit) {
            return (
                <div className="contentContainer">
                    <h3 className="center">Not Allowed to Edit</h3>
                    <br />
                    <p className="center">
                        Please get edit access through the request modal in the
                        upper right corner or go <a href="/home">home</a>
                    </p>
                </div>
            );
        }
        return (
            <div className="contentContainer">
                <div className="contentRow">
                    <div className="halfColumn paddingRight">
                        <Dropdown
                            id="object_dropdown"
                            label="Object Type"
                            titleText="Object Type"
                            light={false}
                            items={this.state.objectTypeOptions}
                            itemToString={this.itemToString}
                            selectedItem={this.getSelected(
                                "objectType",
                                this.state.objectTypeOptions
                            )}
                            initialSelectedItem={this.getSelected(
                                "objectType",
                                this.state.objectTypeOptions
                            )}
                            onChange={e => {
                                if (!e.selectedItem) {
                                    e.selectedItem = { id: "" };
                                }
                                this.setState({
                                    objectType: e.selectedItem.id
                                });
                            }}
                        />
                    </div>
                    <div
                        style={{ paddingTop: "24px" }}
                        className="halfColumn paddingLeft"
                    >
                        <Button
                            size="small"
                            kind="primary"
                            renderIcon={Add20}
                            onClick={() => {
                                this.addNew();
                            }}
                        >
                            Create New
                        </Button>
                    </div>
                </div>
                <div className="contentRow">
                    <div
                        className={
                            "tableContainer " +
                            (this.state.sideExpanded
                                ? "tableContainerSideExpanded"
                                : "tableContainerSideCollapsed")
                        }
                    >
                        {this.genEditTable()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Edit;
