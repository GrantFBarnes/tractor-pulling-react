import React from "react";
import BasePage from "../BasePage";

import { Button, Dropdown, DataTable } from "carbon-components-react";

import Download20 from "@carbon/icons-react/lib/download/20";
import YouTube20 from "@carbon/icons-react/lib/logo--youtube/20";

const {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    TableExpandHeader,
    TableExpandRow,
    TableExpandedRow,
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
        this.state.category = "";
        this.state.metric = "percentile";
        this.state.puller = "";

        this.subjectOptions = [
            { id: "puller", display: "Pullers" },
            { id: "combo", display: "Puller/Tractor" },
            { id: "tractor", display: "Tractors" },
            { id: "brand", display: "Brands" }
        ];
        this.categoryOptions = [
            { id: "", display: "All" },
            { id: "Farm Stock", display: "Farm Stock" },
            { id: "Antique Modified", display: "Antique Modified" }
        ];
        this.metricOptions = [
            { id: "percentile", display: "Position Percentile" },
            { id: "wins", display: "Wins" },
            { id: "hooks", display: "Hooks" },
            { id: "distance", display: "Distance" }
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
                                    <TableRow>
                                        {headers.map((header, i) => (
                                            <TableHeader
                                                key={i}
                                                {...getHeaderProps({
                                                    header
                                                })}
                                            >
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
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

    getInnerRows = data => {
        return [];
    };

    getInnerHeaders = () => {
        return [];
    };

    genInnerTable = data => {
        return (
            <div className="tableContainer indent">
                <DataTable
                    rows={this.getInnerRows(data)}
                    headers={this.getInnerHeaders()}
                    render={({ rows, headers }) => (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header, i) => (
                                            <TableHeader key={i}>
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
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

    genExpandTable = (rows, headers) => {
        let rowMap = {};
        for (let i in rows) {
            rowMap[rows[i].id] = rows[i];
        }
        return (
            <div className={this.getTableContainerClass()}>
                <DataTable
                    rows={rows}
                    headers={headers}
                    isSortable
                    render={({
                        rows,
                        headers,
                        getRowProps,
                        getExpandHeaderProps
                    }) => (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableExpandHeader
                                            enableExpando={true}
                                            {...getExpandHeaderProps()}
                                        />
                                        {headers.map((header, i) => (
                                            <TableHeader key={i}>
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => {
                                        if (!rowMap[row.id]) return null;
                                        return (
                                            <React.Fragment key={row.id}>
                                                <TableExpandRow
                                                    {...getRowProps({ row })}
                                                >
                                                    {row.cells.map(
                                                        (cell, i) => (
                                                            <TableCell
                                                                key={
                                                                    cell.id + i
                                                                }
                                                                className={this.getCellClass(
                                                                    cell,
                                                                    row
                                                                )}
                                                            >
                                                                {cell.value}
                                                            </TableCell>
                                                        )
                                                    )}
                                                </TableExpandRow>
                                                <TableExpandedRow
                                                    colSpan={headers.length + 1}
                                                >
                                                    {this.genInnerTable(
                                                        rowMap[row.id]
                                                    )}
                                                </TableExpandedRow>
                                            </React.Fragment>
                                        );
                                    })}
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

    getHookVal = hook => {
        if (hook[this.state.subject]) return hook[this.state.subject];
        if (this.state.subject === "combo") {
            if (hook.puller && hook.tractor) {
                return hook.puller + " " + hook.tractor;
            }
        } else if (this.state.subject === "brand") {
            const tractor = this.state.allObjects[hook.tractor];
            if (tractor && tractor.brand) return tractor.brand;
        }
        return null;
    };

    requestExcel = () => {
        const pull = this.state.allObjects[this.state.pull];
        const location = this.state.allObjects[pull.location]
            ? this.state.allObjects[pull.location].town +
              ", " +
              this.state.allObjects[pull.location].state
            : "(No Location)";
        const name = pull.date + " - " + location;

        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/excel/pull/" + this.state.pull, {
            credentials: "include"
        })
            .then(response => {
                return response.json();
            })
            .then(response => {
                that.setState({ loading: false });
                that.downloadFile("excel", name + ".xlsx", response);
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to get data");
            });
    };

    getExcelButton = () => {
        const pull = this.state.allObjects[this.state.pull];
        if (!pull) return null;
        return (
            <Button
                style={{ width: "100%" }}
                kind="primary"
                size="field"
                renderIcon={Download20}
                onClick={() => this.requestExcel()}
                title="Download Excel Spreadsheet"
            >
                Excel
            </Button>
        );
    };

    getYouTubeButton = () => {
        const pull = this.state.allObjects[this.state.pull];
        if (!pull) return null;
        if (!pull.youtube) return null;
        return (
            <Button
                style={{ width: "100%" }}
                kind="danger"
                size="field"
                renderIcon={YouTube20}
                href={"https://www.youtube.com/watch?v=" + pull.youtube}
                target="_blank"
                title="Open YouTube link to this Pull"
            >
                YouTube
            </Button>
        );
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
                    let display = obj.date + " - " + location;
                    if (obj.youtube) display += " - (Video)";
                    objs[i] = { id: obj.id, display: display };
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
            case "category":
                return "Category";
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

    genSmWinFilters = (filtered, filters, display) => {
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

        if (filters.includes("category")) {
            dropdowns.push(
                <div key="categoryRow" className="contentRow">
                    {this.genFilterDropdown("category", this.categoryOptions)}
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

        if (filters.includes("excel")) {
            dropdowns.push(
                <div key="excelButton" className="contentRow center">
                    {this.getExcelButton()}
                </div>
            );
        }

        if (filters.includes("youtube")) {
            dropdowns.push(
                <div key="youtubeButton" className="contentRow center">
                    {this.getYouTubeButton()}
                </div>
            );
        }

        if (display) {
            for (let f in display) {
                dropdowns.push(
                    <div key={"displayField" + f} className="contentRow">
                        <label className="bx--label">{f}</label>
                        <p>{display[f]}</p>
                    </div>
                );
            }
        }

        return dropdowns;
    };

    genLgWinFilters = (filtered, filters, display) => {
        let dropdowns = [];

        if (filtered.seasons.length > 1 && filters.includes("season")) {
            dropdowns.push(
                <div
                    key="seasonDropdown"
                    className="sixthColumn paddingLeft paddingRight"
                >
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

        if (filters.includes("category")) {
            dropdowns.push(
                <div
                    key="categoryDropdown"
                    className="quarterColumn paddingLeft paddingRight"
                >
                    {this.genFilterDropdown("category", this.categoryOptions)}
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
                <div
                    key="metricDropdown"
                    className="quarterColumn paddingLeft paddingRight"
                >
                    {this.genFilterDropdown("metric", this.metricOptions)}
                </div>
            );
        }

        if (filters.includes("excel")) {
            dropdowns.push(
                <div
                    key="excelButton"
                    className="eighthColumn paddingLeft paddingRight paddingTop"
                >
                    {this.getExcelButton()}
                </div>
            );
        }

        if (filters.includes("youtube")) {
            dropdowns.push(
                <div
                    key="youtubeButton"
                    className="eighthColumn paddingLeft paddingRight paddingTop"
                >
                    {this.getYouTubeButton()}
                </div>
            );
        }

        if (display) {
            for (let f in display) {
                dropdowns.push(
                    <div
                        key={"displayField" + f}
                        className="quarterColumn paddingLeft paddingRight"
                    >
                        <label className="bx--label">{f}</label>
                        <p>{display[f]}</p>
                    </div>
                );
            }
        }

        return <div className="contentRow">{dropdowns}</div>;
    };

    genFilters = (filtered, filters, display) => {
        if (this.state.smallWindow) {
            return this.genSmWinFilters(filtered, filters, display);
        }
        return this.genLgWinFilters(filtered, filters, display);
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
