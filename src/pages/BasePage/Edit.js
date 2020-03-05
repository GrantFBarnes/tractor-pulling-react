import React from "react";
import BasePage from "../BasePage";
import { Button, Dropdown, DataTable } from "carbon-components-react";

import TypicalDropdown from "../../components/TypicalField/TypicalDropdown";
import TypicalTextInput from "../../components/TypicalField/TypicalTextInput";
import TypicalToggle from "../../components/TypicalField/TypicalToggle";

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
            { id: "Location", display: "Locations" },
            { id: "Pull", display: "Pulls" },
            { id: "Hook", display: "Hooks" },
            { id: "Tractor", display: "Tractors" },
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

    updateObj = e => {
        let newVal = e.target.value;
        if (newVal === "true" || newVal === "on") {
            newVal = false;
        } else if (newVal === "false" || newVal === "off") {
            newVal = true;
        }

        const split = e.target.id.split("*");
        const newJSON = { id: split[0], [split[1]]: newVal };

        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/object", {
            credentials: "include",
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newJSON)
        })
            .then(response => {
                return response.json();
            })
            .then(obj => {
                let allObjects = this.state.allObjects;
                allObjects[obj.id] = obj;
                that.setState({ loading: false, allObjects: allObjects });
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to update object");
            });
    };

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
            case "Location":
                headers.push({ key: "town", header: "Town" });
                headers.push({ key: "state", header: "State" });
                break;
            case "Hook":
                headers.push({ key: "class", header: "Class" });
                headers.push({ key: "puller", header: "Class" });
                headers.push({ key: "tractor", header: "Class" });
                headers.push({ key: "distance", header: "Distance" });
                headers.push({ key: "position", header: "Position" });
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

    getItems = field => {
        let options = [];
        switch (field) {
            case "season":
                for (let id in this.state.allObjects) {
                    const obj = this.state.allObjects[id];
                    if (obj.type !== "Season") continue;
                    options.push({ id: id, display: obj.year });
                }
                break;

            case "location":
                for (let id in this.state.allObjects) {
                    const obj = this.state.allObjects[id];
                    if (obj.type !== "Location") continue;
                    options.push({
                        id: id,
                        display: obj.town + ", " + obj.state
                    });
                }
                break;

            case "pull":
                for (let id in this.state.allObjects) {
                    const obj = this.state.allObjects[id];
                    if (obj.type !== "Pull") continue;
                    const location = this.state.allObjects[obj.location]
                        ? this.state.allObjects[obj.location].town
                        : "(No Town)";
                    const season = this.state.allObjects[obj.season]
                        ? this.state.allObjects[obj.season].year
                        : "(No Year)";
                    options.push({
                        id: id,
                        display: location + " - " + season
                    });
                }
                break;

            case "owner":
                for (let id in this.state.allObjects) {
                    const obj = this.state.allObjects[id];
                    if (obj.type !== "Puller") continue;
                    options.push({
                        id: id,
                        display: obj.first_name + " " + obj.first_name
                    });
                }
                break;

            case "category":
                options.push({ id: "farm", display: "Farm Stock" });
                options.push({ id: "antique", display: "Antique Modified" });
                break;

            case "state":
                options.push({ id: "WI", display: "Wisconsin" });
                options.push({ id: "IL", display: "Illinois" });
                break;

            case "hour":
                options.push({ id: "1", display: "1" });
                options.push({ id: "2", display: "2" });
                options.push({ id: "3", display: "3" });
                options.push({ id: "4", display: "4" });
                options.push({ id: "5", display: "5" });
                options.push({ id: "6", display: "6" });
                options.push({ id: "7", display: "7" });
                options.push({ id: "8", display: "8" });
                options.push({ id: "9", display: "9" });
                options.push({ id: "10", display: "10" });
                options.push({ id: "11", display: "11" });
                options.push({ id: "12", display: "12" });
                break;

            case "minute":
                options.push({ id: "00", display: "00" });
                options.push({ id: "30", display: "30" });
                break;

            case "meridiem":
                options.push({ id: "am", display: "AM" });
                options.push({ id: "pm", display: "PM" });
                break;

            default:
                break;
        }
        return options;
    };

    getCell = cell => {
        const split = cell.id.split(":");
        const id = split[0];
        const header = split[1];
        const obj = this.state.allObjects[id];
        switch (header) {
            case "id":
                return cell.value;

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

            case "season":
            case "location":
            case "pull":
            case "owner":
            case "category":
            case "state":
            case "hour":
            case "minute":
            case "meridiem":
                return (
                    <TypicalDropdown
                        obj={obj}
                        field={header}
                        items={this.getItems(header)}
                        handleUpdate={e => {
                            this.updateObj(e);
                        }}
                    />
                );

            case "blacktop":
            case "member":
                return (
                    <TypicalToggle
                        obj={obj}
                        field={header}
                        handleUpdate={e => {
                            this.updateObj(e);
                        }}
                    />
                );

            default:
                return (
                    <TypicalTextInput
                        obj={obj}
                        field={header}
                        handleUpdate={e => {
                            this.updateObj(e);
                        }}
                    />
                );
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
