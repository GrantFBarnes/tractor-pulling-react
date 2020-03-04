import React from "react";
import BasePage from "../BasePage";
import { Button, Dropdown, DataTable } from "carbon-components-react";

import Add20 from "@carbon/icons-react/lib/add/20";
import Delete20 from "@carbon/icons-react/lib/delete/20";

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
        this.state.objType = "";
        this.state.objTypeOptions = [
            { id: "Season", display: "Seasons" },
            { id: "Pull", display: "Pulls" },
            { id: "Hook", display: "Hooks" },
            { id: "Tractor", display: "Tractor" },
            { id: "Puller", display: "Pullers" },
            { id: "Class", display: "Classes" }
        ];
        this.state.allObjects = {};
    }

    doneMounting() {
        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/objects", { credentials: "include" })
            .then(response => {
                return response.json();
            })
            .then(allObjects => {
                that.setState({ loading: false, allObjects: allObjects });
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to get data");
            });
    }

    createObj = () => {
        if (!this.state.objType) return;
        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/object", {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: this.state.objType })
        })
            .then(response => {
                return response.json();
            })
            .then(newObj => {
                let allObjects = this.state.allObjects;
                allObjects[newObj.id] = newObj;
                that.setState({ loading: false, allObjects: allObjects });
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to create object");
            });
    };

    deleteObj = id => {
        if (!id) return;
        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/object/" + id, {
            credentials: "include",
            method: "DELETE"
        })
            .then(response => {
                if (response.status === 200) {
                    let allObjects = this.state.allObjects;
                    delete allObjects[id];
                    that.setState({ loading: false, allObjects: allObjects });
                } else {
                    that.setState({ loading: false });
                    alert("Failed to delete object");
                }
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to delete object");
            });
    };

    getHeaders = () => {
        let headers = [
            { key: "delete", header: "Delete" },
            { key: "id", header: "ID" }
        ];
        switch (this.state.objType) {
            case "Season":
                headers.push({ key: "year", header: "Year" });
                break;
            case "Hook":
                headers.push({ key: "class", header: "Class" });
                headers.push({ key: "position", header: "Position" });
                headers.push({ key: "name", header: "Name" });
                headers.push({ key: "tractor", header: "Tractor" });
                headers.push({ key: "distance", header: "Distance" });
                break;
            case "Tractor":
                headers.push({ key: "owner", header: "Owner" });
                headers.push({ key: "brand", header: "Brand" });
                headers.push({ key: "model", header: "Model" });
                break;
            case "Puller":
                headers.push({ key: "first_name", header: "First" });
                headers.push({ key: "last_name", header: "Last" });
                headers.push({ key: "member", header: "Member" });
                break;
            case "Class":
                headers.push({ key: "pull", header: "Pull" });
                headers.push({ key: "category", header: "Category" });
                headers.push({ key: "weight", header: "Weight" });
                headers.push({ key: "speed", header: "Speed" });
                break;
            case "Pull":
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

    getRows = () => {
        let rows = [];
        for (let id in this.state.allObjects) {
            const obj = this.state.allObjects[id];
            if (obj.type !== this.state.objType) continue;
            rows.push(obj);
        }
        return rows;
    };

    getCell = cell => {
        const split = cell.id.split(":");
        const id = split[0];
        const header = split[1];
        switch (header) {
            case "delete":
                return (
                    <Button
                        size="small"
                        kind="danger"
                        renderIcon={Delete20}
                        onClick={() => {
                            this.deleteObj(id);
                        }}
                    >
                        Delete
                    </Button>
                );

            default:
                return cell.value;
        }
    };

    genEditTable = () => {
        if (!this.state.objType) return null;
        const headers = this.getHeaders();
        const rows = this.getRows();
        return (
            <DataTable
                rows={rows}
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
                                                {this.getCell(cell)}
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
                            items={this.state.objTypeOptions}
                            itemToString={this.itemToString}
                            selectedItem={this.getSelected(
                                "objType",
                                this.state.objTypeOptions
                            )}
                            initialSelectedItem={this.getSelected(
                                "objType",
                                this.state.objTypeOptions
                            )}
                            onChange={e => {
                                if (!e.selectedItem) {
                                    e.selectedItem = { id: "" };
                                }
                                this.setState({
                                    objType: e.selectedItem.id
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
                                this.createObj();
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
