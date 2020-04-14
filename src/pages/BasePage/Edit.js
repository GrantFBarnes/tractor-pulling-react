import React from "react";
import BasePage from "../BasePage";
import { Button, Dropdown, DataTable } from "carbon-components-react";

import TypicalDropdown from "../../components/TypicalField/TypicalDropdown";
import TypicalTextInput from "../../components/TypicalField/TypicalTextInput";

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
            { id: "Tractor", display: "Tractors" },
            { id: "Puller", display: "Pullers" },
            { id: "Pull", display: "Pulls" },
            { id: "Class", display: "Classes" },
            { id: "Hook", display: "Hooks" }
        ];
        this.state.pullerTractors = {};
        this.state.classPullers = {};
    }

    setupDone() {
        let pullerTractors = {};
        let classPullers = {};
        for (let id in this.state.allObjects) {
            const obj = this.state.allObjects[id];
            if (obj.type === "Hook") {
                const pullerClass = obj.puller + " " + obj.class;
                if (!pullerTractors[pullerClass]) {
                    pullerTractors[pullerClass] = new Set();
                }

                pullerTractors[pullerClass].add(obj.tractor);
            } else if (obj.type === "Class") {
                const classType = this.getClassType(id);
                if (!classPullers[classType]) {
                    classPullers[classType] = new Set();
                }
                for (let i in obj.hooks) {
                    const hook = this.state.allObjects[obj.hooks[i]];
                    if (!hook.puller) continue;
                    classPullers[classType].add(hook.puller);
                }
            }
        }
        this.setState({
            pullerTractors: pullerTractors,
            classPullers: classPullers
        });
    }

    getClassType = id => {
        const obj = this.state.allObjects[id];
        return obj.weight + " " + obj.category + " " + obj.speed;
    };

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
            body: JSON.stringify({
                type: this.state.objType,
                season: this.state.season,
                pull: this.state.pull,
                class: this.state.class
            })
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
        let headers = [];
        switch (this.state.objType) {
            case "Location":
                headers.push({ key: "town", header: "Town" });
                headers.push({ key: "state", header: "State" });
                break;

            case "Puller":
                headers.push({ key: "first_name", header: "First" });
                headers.push({ key: "last_name", header: "Last" });
                break;

            case "Tractor":
                headers.push({ key: "brand", header: "Brand" });
                headers.push({ key: "model", header: "Model" });
                break;

            case "Season":
                headers.push({ key: "year", header: "Year" });
                break;

            case "Pull":
                headers.push({ key: "season", header: "Season" });
                headers.push({ key: "location", header: "Location" });
                headers.push({ key: "date", header: "Date" });
                break;

            case "Class":
                headers.push({ key: "pull", header: "Pull" });
                headers.push({ key: "category", header: "Category" });
                headers.push({ key: "weight", header: "Weight" });
                headers.push({ key: "speed", header: "Speed" });
                break;

            case "Hook":
                headers.push({ key: "class", header: "Class" });
                headers.push({ key: "puller", header: "Puller" });
                headers.push({ key: "tractor", header: "Tractor" });
                headers.push({ key: "distance", header: "Distance" });
                break;

            default:
                break;
        }
        headers.push({ key: "id", header: "ID" });
        headers.push({ key: "delete", header: "Delete" });
        return headers;
    };

    getRows = () => {
        let rows = [];
        for (let id in this.state.allObjects) {
            const obj = this.state.allObjects[id];
            if (obj.type !== this.state.objType) continue;
            switch (this.state.objType) {
                case "Pull":
                    if (obj.season === this.state.season) {
                        rows.push(obj);
                    }
                    break;
                case "Class":
                    if (obj.pull === this.state.pull) {
                        rows.push(obj);
                    }
                    break;
                case "Hook":
                    if (obj.class === this.state.class) {
                        rows.push(obj);
                    }
                    break;
                default:
                    rows.push(obj);
            }
        }
        return rows;
    };

    pullerSort = (a, b) => {
        if (a.first_name < b.first_name) return -1;
        if (a.first_name > b.first_name) return 1;
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;
        return 0;
    };

    tractorSort = (a, b) => {
        if (a.brand < b.brand) return -1;
        if (a.brand > b.brand) return 1;
        if (a.model < b.model) return -1;
        if (a.model > b.model) return 1;
        return 0;
    };

    classSort = (a, b) => {
        if (a.weight < b.weight) return -1;
        if (a.weight > b.weight) return 1;
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
    };

    getItems = (field, row) => {
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
                    if (obj.season !== this.state.season) continue;
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

            case "puller":
                let pullers = [];
                for (let id in this.state.allObjects) {
                    const obj = this.state.allObjects[id];
                    if (obj.type !== "Puller") continue;
                    pullers.push(obj);
                }
                pullers.sort(this.pullerSort);

                const classType = this.getClassType(this.state.class);
                if (this.state.classPullers[classType]) {
                    let normalPullers = [];
                    for (let pid of this.state.classPullers[classType]) {
                        const puller = this.state.allObjects[pid];
                        normalPullers.push(puller);
                    }
                    normalPullers.sort(this.pullerSort);
                    pullers = [...new Set([...normalPullers, ...pullers])];
                }
                for (let i in pullers) {
                    const obj = pullers[i];
                    options.push({
                        id: obj.id,
                        display: obj.first_name + " " + obj.last_name
                    });
                }
                break;

            case "class":
                let classes = [];
                for (let id in this.state.allObjects) {
                    const obj = this.state.allObjects[id];
                    if (obj.type !== "Class") continue;
                    if (obj.pull !== this.state.pull) continue;
                    classes.push(obj);
                }
                classes.sort(this.classSort);
                for (let i in classes) {
                    const obj = classes[i];
                    let display = obj.weight + " " + obj.category;
                    if (obj.speed > 4) display += " (" + obj.speed + ")";
                    options.push({ id: obj.id, display: display });
                }
                break;

            case "tractor":
                let tractors = [];
                for (let id in this.state.allObjects) {
                    const obj = this.state.allObjects[id];
                    if (obj.type !== "Tractor") continue;
                    tractors.push(obj);
                }
                tractors.sort(this.tractorSort);

                const pullerClass = row.puller + " " + row.class;
                if (this.state.pullerTractors[pullerClass]) {
                    let normalTractors = [];
                    for (let tid of this.state.pullerTractors[pullerClass]) {
                        const tractor = this.state.allObjects[tid];
                        normalTractors.push(tractor);
                    }
                    normalTractors.sort(this.tractorSort);
                    tractors = [...new Set([...normalTractors, ...tractors])];
                }
                for (let i in tractors) {
                    const obj = tractors[i];
                    options.push({
                        id: obj.id,
                        display: obj.brand + " " + obj.model
                    });
                }
                break;

            case "category":
                options.push({ id: "Farm Stock", display: "Farm Stock" });
                options.push({
                    id: "Antique Modified",
                    display: "Antique Modified"
                });
                break;

            case "state":
                options.push({ id: "WI", display: "Wisconsin" });
                options.push({ id: "IL", display: "Illinois" });
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
            case "class":
            case "puller":
            case "tractor":
            case "category":
            case "state":
                return (
                    <TypicalDropdown
                        obj={obj}
                        field={header}
                        items={this.getItems(header, obj)}
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

    genFilters = filtered => {
        switch (this.state.objType) {
            case "Pull":
                return (
                    <div className="contentRow">
                        {filtered.seasons.length
                            ? this.genSeasonDropdown(filtered)
                            : null}
                    </div>
                );
            case "Class":
                return (
                    <div className="contentRow">
                        <div className="halfColumn paddingRight">
                            {filtered.seasons.length
                                ? this.genSeasonDropdown(filtered)
                                : null}
                        </div>
                        <div className="halfColumn paddingLeft">
                            {filtered.pulls.length
                                ? this.genPullDropdown(filtered)
                                : null}
                        </div>
                    </div>
                );
            case "Hook":
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
            default:
                return null;
        }
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
        const filtered = this.getFiltered();
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
                                this.setState({ objType: e.selectedItem.id });
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
                {this.genFilters(filtered)}
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
