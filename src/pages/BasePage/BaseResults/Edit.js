import React from "react";
import BaseResults from "../BaseResults";

import {
    Button,
    Toggle,
    TextInput,
    Dropdown,
    DataTable
} from "carbon-components-react";

import TypicalDropdown from "../../../components/TypicalField/TypicalDropdown";
import TypicalTextInput from "../../../components/TypicalField/TypicalTextInput";
import ImportModal from "../../../components/ImportModal";

import Add20 from "@carbon/icons-react/lib/add/20";
import Delete20 from "@carbon/icons-react/lib/delete/20";
import Edit20 from "@carbon/icons-react/lib/edit/20";
import Import20 from "@carbon/icons-react/lib/document--import/20";

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

class Edit extends BaseResults {
    constructor() {
        super();
        this.state.edit_secret = "";
        this.state.canEdit = false;

        this.state.objType = "";
        this.state.includeAll = false;

        this.state.modalOpen = false;

        this.state.pullerTractors = {};
        this.state.classPullers = {};
        this.state.options = {};
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
                let allTypes = this.state.allTypes;
                allTypes[obj.type][obj.id] = obj;
                that.setState({
                    loading: false,
                    allObjects: allObjects,
                    allTypes: allTypes
                });
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
                let allTypes = this.state.allTypes;
                if (!allTypes[newObj.type]) allTypes[newObj.type] = {};
                allTypes[newObj.type][newObj.id] = newObj;
                that.setState({
                    loading: false,
                    allObjects: allObjects,
                    allTypes: allTypes
                });
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
        const objType = this.state.allObjects[id].type;
        fetch(this.server_host + "/api/object/" + id, {
            credentials: "include",
            method: "DELETE"
        })
            .then(response => {
                if (response.status === 200) {
                    let allObjects = this.state.allObjects;
                    delete allObjects[id];
                    let allTypes = this.state.allTypes;
                    delete allTypes[objType][id];
                    that.setState({
                        loading: false,
                        allObjects: allObjects,
                        allTypes: allTypes
                    });
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

    importFile = body => {
        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/excel/pull", {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.status === 200) {
                    window.location.reload();
                } else {
                    that.setState({ loading: false });
                    alert("Failed to import file");
                }
            })
            .catch(() => {
                that.setState({ loading: false });
                alert("Failed to import file ");
            });
    };

    openModal = () => {
        this.setState({ modalOpen: true });
    };

    closeModal = () => {
        this.setState({ modalOpen: false });
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
                headers.push({ key: "youtube", header: "YouTube" });
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
        for (let id in this.state.allTypes[this.state.objType]) {
            const obj = this.state.allTypes[this.state.objType][id];
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

    getItems = (field, row) => {
        let options = [];
        let classType = "";
        switch (field) {
            case "pull":
                for (let id in this.state.options.pull) {
                    const obj = this.state.options.pull[id];
                    if (obj.season !== this.state.season) continue;
                    options.push(obj);
                }
                break;

            case "class":
                for (let id in this.state.options.class) {
                    const obj = this.state.options.class[id];
                    if (obj.pull !== this.state.pull) continue;
                    options.push(obj);
                }
                break;

            case "puller":
                classType = this.getClassType(this.state.class);
                if (this.state.includeAll) {
                    options = this.state.options.puller;
                } else {
                    options = this.state.classPullers[classType];
                }
                break;

            case "tractor":
                classType = this.getClassType(row.class);
                const pullerClass = row.puller + " " + classType;
                if (this.state.includeAll) {
                    options = this.state.options.tractor;
                } else {
                    options = this.state.pullerTractors[pullerClass];
                }
                break;

            default:
                options = this.state.options[field];
                break;
        }
        if (!options) options = [];
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
                            ? this.genFilterDropdown("season", filtered.seasons)
                            : null}
                    </div>
                );
            case "Class":
                return (
                    <div className="contentRow">
                        <div className="halfColumn paddingRight">
                            {filtered.seasons.length
                                ? this.genFilterDropdown(
                                      "season",
                                      filtered.seasons
                                  )
                                : null}
                        </div>
                        <div className="halfColumn paddingLeft">
                            {filtered.pulls.length
                                ? this.genFilterDropdown("pull", filtered.pulls)
                                : null}
                        </div>
                    </div>
                );
            case "Hook":
                return (
                    <div className="contentRow">
                        <div className="thirdColumn paddingRight">
                            {filtered.seasons.length
                                ? this.genFilterDropdown(
                                      "season",
                                      filtered.seasons
                                  )
                                : null}
                        </div>
                        <div className="thirdColumn paddingLeft paddingRight">
                            {filtered.pulls.length
                                ? this.genFilterDropdown("pull", filtered.pulls)
                                : null}
                        </div>
                        <div className="thirdColumn paddingLeft">
                            {filtered.classes.length
                                ? this.genFilterDropdown(
                                      "class",
                                      filtered.classes
                                  )
                                : null}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    requestEditAccess = () => {
        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/token", {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ edit_secret: this.state.edit_secret })
        })
            .then(response => {
                if (response.status === 200) {
                    that.genOptions();
                } else {
                    that.setState({ loading: false, canEdit: false });
                    alert("Invalid Secret, Access Denied");
                }
            })
            .catch(err => {
                that.setState({ loading: false, canEdit: false });
                alert("Error, please try again");
            });
    };

    titleRender() {
        return "Edit";
    }

    cannotEditContent() {
        return (
            <div className="contentContainer">
                <h4 className="center redText">Not Authorized</h4>
                <p className="center">
                    Please enter the secret below to gain access to edit
                </p>
                <div className="threeQuartersColumn paddingRight">
                    <TextInput
                        id="edit_secret"
                        labelText="Edit Secret"
                        placeholder="Enter edit secret to gain access"
                        value={this.state.edit_secret}
                        onChange={e => {
                            const target = e.target;
                            this.setState({ edit_secret: target.value });
                        }}
                    />
                </div>

                <div
                    style={{ paddingTop: "24px" }}
                    className="quarterColumn paddingLeft"
                >
                    <Button
                        size="field"
                        kind="danger"
                        renderIcon={Edit20}
                        onClick={() => {
                            this.requestEditAccess();
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        );
    }

    contentRender() {
        if (!this.state.canEdit) {
            return this.cannotEditContent();
        }
        const filtered = this.getFiltered();
        const objTypeOptions = [
            { id: "Location", display: "Locations" },
            { id: "Tractor", display: "Tractors" },
            { id: "Puller", display: "Pullers" },
            { id: "Season", display: "Seasons" },
            { id: "Pull", display: "Pulls" },
            { id: "Class", display: "Classes" },
            { id: "Hook", display: "Hooks" }
        ];
        return (
            <div className="contentContainer">
                <div className="contentRow">
                    <div className="quarterColumn paddingRight">
                        <Dropdown
                            id="object_dropdown"
                            label="Object Type"
                            titleText="Object Type"
                            light={false}
                            items={objTypeOptions}
                            itemToString={this.itemToString}
                            selectedItem={this.getSelected(
                                "objType",
                                objTypeOptions
                            )}
                            initialSelectedItem={this.getSelected(
                                "objType",
                                objTypeOptions
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
                        className="quarterColumn paddingLeft paddingRight"
                    >
                        <Button
                            size="field"
                            kind="primary"
                            renderIcon={Add20}
                            onClick={() => {
                                this.createObj();
                            }}
                        >
                            Create New
                        </Button>
                    </div>
                    <div className="quarterColumn paddingLeft paddingRight">
                        <Toggle
                            labelText="Dropdown Options"
                            toggled={this.state.includeAll ? true : false}
                            id="include_all_toggle"
                            labelA="Only Done Before"
                            labelB="Include All Options"
                            onToggle={e => {
                                this.setState({ includeAll: e });
                            }}
                        />
                    </div>
                    <div className="quarterColumn paddingLeft">
                        <Button
                            size="small"
                            kind="ghost"
                            renderIcon={Import20}
                            onClick={() => this.openModal()}
                        >
                            Import Excel
                        </Button>
                    </div>
                </div>
                {this.genFilters(filtered)}
                <div className="contentRow">
                    <div className={this.getTableContainerClass()}>
                        {this.genEditTable()}
                    </div>
                </div>

                <ImportModal
                    open={this.state.modalOpen}
                    closeModal={this.closeModal}
                    importFile={this.importFile}
                />
            </div>
        );
    }

    pullerSort = (a, b) => {
        if (a.first_name < b.first_name) return -1;
        if (a.first_name > b.first_name) return 1;
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;
        return 0;
    };

    genOptions() {
        let pullerTractors = {};
        let classPullers = {};
        for (let id in this.state.allTypes.Hook) {
            const obj = this.state.allTypes.Hook[id];
            if (!obj.puller) continue;
            if (!obj.class) continue;
            if (!obj.tractor) continue;

            const classType = this.getClassType(obj.class);

            if (!classPullers[classType]) {
                classPullers[classType] = new Set();
            }
            classPullers[classType].add(obj.puller);

            const pullerClass = obj.puller + " " + classType;
            if (!pullerTractors[pullerClass]) {
                pullerTractors[pullerClass] = new Set();
            }
            pullerTractors[pullerClass].add(obj.tractor);
        }

        // Sort helpers

        for (let c in classPullers) {
            let pList = [];
            for (let pid of classPullers[c]) {
                pList.push(this.state.allObjects[pid]);
            }
            pList = pList.sort(this.pullerSort);
            for (let i in pList) {
                const puller = pList[i];
                pList[i] = {
                    id: puller.id,
                    display: puller.first_name + " " + puller.last_name
                };
            }
            classPullers[c] = pList;
        }

        for (let c in pullerTractors) {
            let tList = [];
            for (let pid of pullerTractors[c]) {
                tList.push(this.state.allObjects[pid]);
            }
            tList = tList.sort(this.tractorSort);
            for (let i in tList) {
                const tractor = tList[i];
                tList[i] = {
                    id: tractor.id,
                    display: tractor.brand + " " + tractor.model
                };
            }
            pullerTractors[c] = tList;
        }

        // get constant options

        let options = {
            season: [],
            location: [],
            pull: [],
            class: [],
            puller: [],
            tractor: [],
            category: [
                { id: "Farm Stock", display: "Farm Stock" },
                { id: "Antique Modified", display: "Antique Modified" }
            ],
            state: [
                { id: "WI", display: "Wisconsin" },
                { id: "IL", display: "Illinois" }
            ]
        };

        for (let id in this.state.allTypes.Season) {
            const obj = this.state.allTypes.Season[id];
            options.season.push({ id: id, display: obj.year });
        }

        for (let id in this.state.allTypes.Location) {
            const obj = this.state.allTypes.Location[id];
            options.location.push({
                id: id,
                display: obj.town + ", " + obj.state
            });
        }

        for (let id in this.state.allTypes.Pull) {
            const obj = this.state.allTypes.Pull[id];
            const location = this.state.allObjects[obj.location]
                ? this.state.allObjects[obj.location].town
                : "(No Town)";
            const season = this.state.allObjects[obj.season]
                ? this.state.allObjects[obj.season].year
                : "(No Year)";
            options.pull.push({
                id: id,
                display: location + " - " + season,
                season: obj.season
            });
        }

        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];
            let display = obj.weight + " " + obj.category;
            if (obj.speed > 4) display += " (" + obj.speed + ")";
            options.class.push({
                id: obj.id,
                display: display,
                pull: obj.pull
            });
        }

        let pType = Object.values(this.state.allTypes.Puller).sort(
            this.pullerSort
        );
        for (let id in pType) {
            const obj = pType[id];
            options.puller.push({
                id: obj.id,
                display: obj.first_name + " " + obj.last_name
            });
        }

        let tType = Object.values(this.state.allTypes.Tractor).sort(
            this.tractorSort
        );
        for (let i in tType) {
            const obj = tType[i];
            options.tractor.push({
                id: obj.id,
                display: obj.brand + " " + obj.model
            });
        }

        this.setState({
            loading: false,
            canEdit: true,
            pullerTractors: pullerTractors,
            classPullers: classPullers,
            options: options
        });
    }

    postDataSetUp() {
        const that = this;
        fetch(this.server_host + "/api/authenticated", {
            credentials: "include"
        })
            .then(response => {
                if (response.status === 200) {
                    that.genOptions();
                }
            })
            .catch(err => {});
    }
}

export default Edit;
