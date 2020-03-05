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

    doneMounting() {
        let newState = { loading: true };
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
        }
        this.setState(newState);

        const that = this;
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
                results.seasons.push({ id: id, display: obj.year });
            } else if (obj.type === "Pull") {
                if (obj.season === this.state.season) {
                    const location = this.state.allObjects[obj.location]
                        ? this.state.allObjects[obj.location].town +
                          ", " +
                          this.state.allObjects[obj.location].state
                        : "(No Location)";
                    results.pulls.push({ id: id, display: location });
                }
            } else if (obj.type === "Class") {
                if (obj.pull === this.state.pull) {
                    results.classes.push({
                        id: id,
                        display: obj.weight + " " + obj.category
                    });
                }
            } else if (obj.type === "Hook") {
                if (obj.class === this.state.class) {
                    results.hooks.push({
                        id: id,
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
                    });
                }
            }
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
                        {this.state.class ? (
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
