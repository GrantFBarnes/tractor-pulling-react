import React from "react";
import BasePage from "../BasePage";
import { Dropdown, DataTable } from "carbon-components-react";

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
    constructor() {
        super();
        this.state.allObjects = {};

        this.state.season = "";
        this.state.pull = "";
        this.state.class = "";
    }

    setUp = allObjects => {
        let newState = { loading: false, allObjects: allObjects };
        if (this.props.location.search) {
            const params = this.props.location.search.split("&");
            for (let i in params) {
                params[i] = params[i].replace("?", "");
                let split = params[i].split("=");
                if (split[0] === "season") {
                    newState.season = split[1];
                } else if (split[0] === "pull") {
                    newState.pull = split[1];
                } else if (split[0] === "class") {
                    newState.class = split[1];
                }
            }
        } else {
            let latestSeason = {};
            for (let id in allObjects) {
                const obj = allObjects[id];
                if (obj.type !== "Season") continue;
                if (!latestSeason.year || obj.year > latestSeason.year) {
                    latestSeason = obj;
                }
            }
            newState.season = latestSeason.id;

            let latestPull = {};
            for (let id in allObjects) {
                const obj = allObjects[id];
                if (obj.type !== "Pull") continue;
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
            for (let id in allObjects) {
                const obj = allObjects[id];
                if (obj.type !== "Class") continue;
                if (obj.pull !== latestPull.id) continue;
                if (!latestClass.weight || obj.weight < latestClass.weight) {
                    latestClass = obj;
                }
                if (
                    !latestClass.category ||
                    obj.category < latestClass.category
                ) {
                    latestClass = obj;
                }
            }
            newState.class = latestClass.id;
        }
        this.setState(newState);
    };

    doneMounting() {
        const that = this;
        this.setState({ loading: true });
        fetch(this.server_host + "/api/objects", { credentials: "include" })
            .then(response => {
                return response.json();
            })
            .then(allObjects => {
                this.setUp(allObjects);
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to get data");
            });
    }

    genResultsTable = hooks => {
        return (
            <DataTable
                rows={hooks}
                headers={[
                    { key: "position", header: "Position" },
                    { key: "name", header: "Name" },
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
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
    };

    hookSort = (a, b) => {
        if (a.position < b.position) return -1;
        if (a.position > b.position) return 1;
        return 0;
    };

    getDisplay = (objs, type) => {
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
                    objs[i] = {
                        id: obj.id,
                        display: obj.weight + " " + obj.category
                    };
                }
                break;

            case "hooks":
                for (let i in objs) {
                    const obj = objs[i];
                    objs[i] = {
                        id: obj.id,
                        position: obj.position,
                        name: this.state.allObjects[obj.puller]
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

            default:
                break;
        }
        return objs;
    };

    getResults = () => {
        let results = {
            seasons: [],
            pulls: [],
            classes: [],
            hooks: []
        };
        for (let id in this.state.allObjects) {
            const obj = this.state.allObjects[id];
            if (obj.type === "Season") {
                results.seasons.push(obj);
            } else if (obj.type === "Pull") {
                if (obj.season === this.state.season) {
                    results.pulls.push(obj);
                }
            } else if (obj.type === "Class") {
                if (obj.pull === this.state.pull) {
                    results.classes.push(obj);
                }
            } else if (obj.type === "Hook") {
                if (obj.class === this.state.class) {
                    results.hooks.push(obj);
                }
            }
        }

        results.seasons.sort(this.seasonSort);
        results.pulls.sort(this.pullSort);
        results.classes.sort(this.classSort);
        results.hooks.sort(this.hookSort);

        for (let i in results) {
            results[i] = this.getDisplay(results[i], i);
        }

        if (!results.seasons.length) {
            results.pulls = [];
            results.classes = [];
            results.hooks = [];
        } else if (!results.pulls.length) {
            results.classes = [];
            results.hooks = [];
        } else if (!results.classes.length) {
            results.hooks = [];
        }

        return results;
    };

    contentRender() {
        const results = this.getResults();
        return (
            <div className="contentContainer">
                <div className="contentRow">
                    <div className="thirdColumn paddingRight">
                        {results.seasons.length ? (
                            <Dropdown
                                id="seasons_dropdown"
                                label="Season"
                                titleText="Season"
                                light={false}
                                items={results.seasons}
                                itemToString={this.itemToString}
                                selectedItem={this.getSelected(
                                    "season",
                                    results.seasons
                                )}
                                initialSelectedItem={this.getSelected(
                                    "season",
                                    results.seasons
                                )}
                                onChange={e => {
                                    if (!e.selectedItem) {
                                        e.selectedItem = { id: "" };
                                    }
                                    this.setState({
                                        season: e.selectedItem.id
                                    });
                                }}
                            />
                        ) : null}
                    </div>
                    <div className="thirdColumn paddingLeft paddingRight">
                        {results.pulls.length ? (
                            <Dropdown
                                id="pull_dropdown"
                                label="Pull"
                                titleText="Pull"
                                light={false}
                                items={results.pulls}
                                itemToString={this.itemToString}
                                selectedItem={this.getSelected(
                                    "pull",
                                    results.pulls
                                )}
                                initialSelectedItem={this.getSelected(
                                    "pull",
                                    results.pulls
                                )}
                                onChange={e => {
                                    if (!e.selectedItem) {
                                        e.selectedItem = { id: "" };
                                    }
                                    this.setState({ pull: e.selectedItem.id });
                                }}
                            />
                        ) : null}
                    </div>
                    <div className="thirdColumn paddingLeft">
                        {results.classes.length ? (
                            <Dropdown
                                id="class_dropdown"
                                label="Class"
                                titleText="Class"
                                light={false}
                                items={results.classes}
                                itemToString={this.itemToString}
                                selectedItem={this.getSelected(
                                    "class",
                                    results.classes
                                )}
                                initialSelectedItem={this.getSelected(
                                    "class",
                                    results.classes
                                )}
                                onChange={e => {
                                    if (!e.selectedItem) {
                                        e.selectedItem = { id: "" };
                                    }
                                    this.setState({ class: e.selectedItem.id });
                                }}
                            />
                        ) : null}
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
                        {results.hooks.length ? (
                            this.genResultsTable(results.hooks)
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
