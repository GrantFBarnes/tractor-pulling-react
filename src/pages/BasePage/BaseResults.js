import React from "react";
import BasePage from "../BasePage";

import { Dropdown, DataTable } from "carbon-components-react";

import "../../styling/BasePage.css";

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

class BaseResults extends BasePage {
    constructor() {
        super();
        this.state.allObjects = {};
        this.state.allTypes = {};
        this.state.season = "";
        this.state.pull = "";
        this.state.class = "";
        this.state.subject = "puller";
        this.state.metric = "wins";
        this.state.puller = "";

        this.subjectOptions = [
            { id: "puller", display: "Pullers" },
            { id: "combo", display: "Puller/Tractor" },
            { id: "tractor", display: "Tractors" },
            { id: "brand", display: "Brands" }
        ];
        this.metricOptions = [
            { id: "wins", display: "Wins" },
            { id: "hooks", display: "Hooks" },
            { id: "distance", display: "Distance" },
            { id: "percentile", display: "Position Percentile" }
        ];
    }

    getClassType = id => {
        const obj = this.state.allObjects[id];
        if (!obj) return "";
        if (!obj.weight) return "";
        let result = obj.weight + " " + obj.category;
        if (obj.speed === 6) result += " (" + obj.speed + ")";
        return result;
    };

    getSubjectHeader = () => {
        switch (this.state.subject) {
            case "puller":
                return "Puller";

            case "combo":
                return "Puller/Tractor";

            case "tractor":
                return "Tractor";

            case "brand":
                return "Brand";

            default:
                return "";
        }
    };

    getSubjectDisplay = subject => {
        let display = "";
        switch (this.state.subject) {
            case "puller":
                display = subject.first_name + " " + subject.last_name;
                break;

            case "combo":
                const split = subject.split(" ");
                const puller = this.state.allObjects[split[0]];
                if (puller) {
                    display += puller.first_name + " " + puller.last_name;
                }
                display += " - ";
                const tractor = this.state.allObjects[split[1]];
                if (tractor) {
                    display += tractor.brand + " " + tractor.model;
                }
                break;

            case "tractor":
                display = subject.brand + " " + subject.model;
                break;

            case "brand":
                display = subject;
                break;

            default:
                break;
        }
        return display;
    };

    getTableContainerClass = () => {
        if (this.state.sideExpanded) {
            return "tableContainer tableContainerSideExpanded";
        }
        return "tableContainer tableContainerSideCollapsed";
    };

    getCellClass = (cell, row) => {
        return "";
    };

    genDataTable = (rows, headers) => {
        return (
            <div className={this.getTableContainerClass()}>
                <DataTable
                    rows={rows}
                    headers={headers}
                    isSortable
                    render={({
                        rows,
                        headers,
                        getHeaderProps,
                        onInputChange
                    }) => (
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
                                                <TableCell
                                                    key={cell.id}
                                                    className={this.getCellClass(
                                                        cell,
                                                        row
                                                    )}
                                                >
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
            </div>
        );
    };

    ////////////////////////////////////////////////////////////////////////////
    // Generate Filters

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

    tractorSort = (a, b) => {
        if (a.brand < b.brand) return -1;
        if (a.brand > b.brand) return 1;
        if (a.model < b.model) return -1;
        if (a.model > b.model) return 1;
        return 0;
    };

    pullerSort = (a, b) => {
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;
        if (a.first_name < b.first_name) return -1;
        if (a.first_name > b.first_name) return 1;
        return 0;
    };

    getFilterDisplay = (objs, type) => {
        switch (type) {
            case "seasons":
                for (let i in objs) {
                    const obj = objs[i];
                    objs[i] = { id: obj.id, display: obj.year };
                }
                break;

            case "pulls":
                for (let i in objs) {
                    const obj = objs[i];
                    const location = this.state.allObjects[obj.location]
                        ? this.state.allObjects[obj.location].town +
                          ", " +
                          this.state.allObjects[obj.location].state
                        : "(No Location)";
                    objs[i] = {
                        id: obj.id,
                        display: obj.date + " - " + location
                    };
                }
                break;

            case "classes":
                for (let i in objs) {
                    const obj = objs[i];
                    let display = obj.weight + " " + obj.category;
                    if (obj.speed > 4) display += " (" + obj.speed + ")";
                    objs[i] = { id: obj.id, display: display };
                }
                break;

            case "hooks":
                for (let i in objs) {
                    const obj = objs[i];
                    objs[i] = {
                        id: obj.id,
                        position: obj.position,
                        puller: this.state.allObjects[obj.puller]
                            ? this.state.allObjects[obj.puller].first_name +
                              " " +
                              this.state.allObjects[obj.puller].last_name
                            : "(No Puller)",
                        tractor: this.state.allObjects[obj.tractor]
                            ? this.state.allObjects[obj.tractor].brand +
                              " " +
                              this.state.allObjects[obj.tractor].model
                            : "(No Tractor)",
                        distance: obj.distance
                    };
                }
                break;

            case "pullers":
                for (let i in objs) {
                    const obj = objs[i];
                    objs[i] = {
                        id: obj.id,
                        display: obj.last_name + ", " + obj.first_name
                    };
                }
                break;

            default:
                break;
        }
        return objs;
    };

    getFilterLabel = filter => {
        switch (filter) {
            case "season":
                return "Season";
            case "pull":
                return "Pull";
            case "class":
                return "Class";
            case "subject":
                return "Subject";
            case "metric":
                return "Metric";
            case "puller":
                return "Puller";
            default:
                return filter;
        }
    };

    itemToString = item => {
        if (item) return item.display;
        return "";
    };

    getSelected = (field, options) => {
        for (let i in options) {
            if (options[i].id === this.state[field]) {
                return options[i];
            }
        }
        return { id: "", display: this.state[field] };
    };

    genFilterDropdown = (filter, filtered) => {
        return (
            <Dropdown
                id={filter + "_dropdown"}
                label={this.getFilterLabel(filter)}
                titleText={this.getFilterLabel(filter)}
                light={false}
                items={filtered}
                itemToString={this.itemToString}
                selectedItem={this.getSelected(filter, filtered)}
                initialSelectedItem={this.getSelected(filter, filtered)}
                onChange={e => {
                    if (!e.selectedItem) e.selectedItem = { id: "" };
                    let newState = {};
                    newState[filter] = e.selectedItem.id;
                    if (filter === "season" || filter === "pull") {
                        newState.class = "";
                        if (filter === "season") {
                            newState.pull = "";
                        }
                    }
                    this.setState(newState);
                }}
            />
        );
    };

    genSmWinFilters = (filtered, filters) => {
        let dropdowns = [];
        if (filtered.seasons.length > 1 && filters.includes("season")) {
            dropdowns.push(
                <div key="seasonRow" className="contentRow">
                    {this.genFilterDropdown("season", filtered.seasons)}
                </div>
            );
        }
        if (filtered.pulls.length > 1 && filters.includes("pull")) {
            dropdowns.push(
                <div key="pullRow" className="contentRow">
                    {this.genFilterDropdown("pull", filtered.pulls)}
                </div>
            );
        }
        if (filtered.classes.length > 1 && filters.includes("class")) {
            dropdowns.push(
                <div key="classRow" className="contentRow">
                    {this.genFilterDropdown("class", filtered.classes)}
                </div>
            );
        }
        if (filters.includes("subject")) {
            dropdowns.push(
                <div key="subjectRow" className="contentRow">
                    {this.genFilterDropdown("subject", this.subjectOptions)}
                </div>
            );
        }
        if (filters.includes("puller")) {
            dropdowns.push(
                <div key="pullerRow" className="contentRow">
                    {this.genFilterDropdown("puller", filtered.pullers)}
                </div>
            );
        }
        if (filters.includes("metric")) {
            dropdowns.push(
                <div key="metricRow" className="contentRow">
                    {this.genFilterDropdown("metric", this.metricOptions)}
                </div>
            );
        }
        return dropdowns;
    };

    genLgWinFilters = (filtered, filters) => {
        let dropdowns = [];
        if (filtered.seasons.length > 1 && filters.includes("season")) {
            dropdowns.push(
                <div key="seasonDropdown" className="sixthColumn paddingRight">
                    {this.genFilterDropdown("season", filtered.seasons)}
                </div>
            );
        }
        if (filtered.pulls.length > 1 && filters.includes("pull")) {
            dropdowns.push(
                <div
                    key="pullDropdown"
                    className="thirdColumn paddingLeft paddingRight"
                >
                    {this.genFilterDropdown("pull", filtered.pulls)}
                </div>
            );
        }
        if (filtered.classes.length > 1 && filters.includes("class")) {
            dropdowns.push(
                <div
                    key="classDropdown"
                    className="thirdColumn paddingLeft paddingRight"
                >
                    {this.genFilterDropdown("class", filtered.classes)}
                </div>
            );
        }
        if (filters.includes("subject")) {
            dropdowns.push(
                <div
                    key="subjectDropdown"
                    className="quarterColumn paddingLeft paddingRight"
                >
                    {this.genFilterDropdown("subject", this.subjectOptions)}
                </div>
            );
        }
        if (filters.includes("puller")) {
            dropdowns.push(
                <div
                    key="pullerDropdown"
                    className="quarterColumn paddingLeft paddingRight"
                >
                    {this.genFilterDropdown("puller", filtered.pullers)}
                </div>
            );
        }
        if (filters.includes("metric")) {
            dropdowns.push(
                <div key="metricDropdown" className="quarterColumn paddingLeft">
                    {this.genFilterDropdown("metric", this.metricOptions)}
                </div>
            );
        }
        return <div className="contentRow">{dropdowns}</div>;
    };

    genFilters = (filtered, filters) => {
        if (this.state.smallWindow) {
            return this.genSmWinFilters(filtered, filters);
        }
        return this.genLgWinFilters(filtered, filters);
    };

    getFiltered = () => {
        let filtered = {
            seasons: [],
            pulls: [],
            classes: [],
            hooks: [],
            pullers: []
        };

        let seasonFound = false;
        for (let id in this.state.allTypes.Season) {
            const obj = this.state.allTypes.Season[id];
            filtered.seasons.push(obj);
            if (id === this.state.season) seasonFound = true;
        }
        filtered.seasons.sort(this.seasonSort);

        let pullFound = false;
        for (let id in this.state.allTypes.Pull) {
            const obj = this.state.allTypes.Pull[id];
            if (obj.season === this.state.season) {
                filtered.pulls.push(obj);
                if (id === this.state.pull) pullFound = true;
            }
        }
        filtered.pulls.sort(this.pullSort);

        let classFound = false;
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];
            if (obj.pull === this.state.pull) {
                filtered.classes.push(obj);
                if (id === this.state.class) classFound = true;
            }
        }
        filtered.classes.sort(this.classSort);

        for (let id in this.state.allTypes.Hook) {
            const obj = this.state.allTypes.Hook[id];
            if (obj.class === this.state.class) {
                filtered.hooks.push(obj);
            }
        }
        filtered.hooks.sort(this.hookSort);

        for (let id in this.state.allTypes.Puller) {
            const obj = this.state.allTypes.Puller[id];
            filtered.pullers.push(obj);
        }
        filtered.pullers.sort(this.pullerSort);

        for (let i in filtered) {
            filtered[i] = this.getFilterDisplay(filtered[i], i);
        }

        if (!filtered.seasons.length || !seasonFound) filtered.pulls = [];
        if (!filtered.pulls.length || !pullFound) filtered.classes = [];
        if (!filtered.classes.length || !classFound) filtered.hooks = [];

        filtered.seasons.unshift({ id: "", display: "All" });
        filtered.pulls.unshift({ id: "", display: "All" });
        filtered.classes.unshift({ id: "", display: "All" });

        return filtered;
    };

    ////////////////////////////////////////////////////////////////////////////

    postDataSetUp() {}

    setUpData(allObjects) {
        let newState = { loading: false, allObjects: allObjects };
        let allTypes = {};
        for (let id in allObjects) {
            const obj = allObjects[id];
            if (!allTypes[obj.type]) allTypes[obj.type] = {};
            allTypes[obj.type][id] = obj;
        }
        newState.allTypes = allTypes;

        // Set filter defaults
        if (this.props.location.search) {
            // Set based on URL parameters
            const params = this.props.location.search.split("&");
            for (let i in params) {
                params[i] = params[i].replace("?", "");
                let split = params[i].split("=");
                newState[split[0]] = split[1];
            }
        } else {
            // Set to the latest pull
            let latestSeason = {};
            for (let id in allTypes.Season) {
                const obj = allTypes.Season[id];
                if (!latestSeason.year || obj.year > latestSeason.year) {
                    latestSeason = obj;
                }
            }
            newState.season = latestSeason.id;

            let latestPull = {};
            for (let id in allTypes.Pull) {
                const obj = allTypes.Pull[id];
                if (obj.season !== latestSeason.id) continue;
                if (
                    !latestPull.date ||
                    new Date(obj.date) > new Date(latestPull.date)
                ) {
                    latestPull = obj;
                }
            }
            newState.pull = latestPull.id;

            let latestClass = {};
            for (let id in allTypes.Class) {
                const obj = allTypes.Class[id];
                if (obj.pull !== latestPull.id) continue;
                if (!latestClass.weight) {
                    latestClass = obj;
                    continue;
                }
                if (obj.weight < latestClass.weight) {
                    latestClass = obj;
                }
                if (obj.category > latestClass.category) {
                    latestClass = obj;
                }
                if (obj.speed < latestClass.speed) {
                    latestClass = obj;
                }
            }
            newState.class = latestClass.id;
        }
        this.setState(newState);
        this.postDataSetUp();
    }

    setUp() {
        const that = this;
        fetch(this.server_host + "/api/objects", { credentials: "include" })
            .then(response => {
                return response.json();
            })
            .then(allObjects => {
                that.setUpData(allObjects);
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to get data");
            });
    }
}

export default BaseResults;
