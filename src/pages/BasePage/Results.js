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
        this.state.season = "";
        this.state.seasonOptions = [
            { id: "2020", display: "2020" },
            { id: "2019", display: "2019" },
            { id: "2018", display: "2018" }
        ];
        this.state.pull = "";
        this.state.pullOptions = [
            { id: "argyle", display: "Argyle, WI" },
            { id: "blanchardville", display: "Blanchardville, WI" },
            { id: "brooklyn", display: "Brooklyn, WI" },
            { id: "durand", display: "Durand, IL" }
        ];
        this.state.class = "";
        this.state.classOptions = [
            { id: "4000f", display: "4000 Farm" },
            { id: "4000a", display: "4000 Antique" },
            { id: "4500f", display: "4500 Farm" },
            { id: "4500a", display: "4500 Antique" },
            { id: "5000f", display: "5000 Farm" },
            { id: "5000a", display: "5000 Antique" },
            { id: "5500f", display: "5500 Farm" },
            { id: "5500a", display: "5500 Antique" },
            { id: "6000f", display: "6000 Farm" },
            { id: "6000a", display: "6000 Antique" }
        ];

        this.state.headers = [
            { key: "position", header: "Position" },
            { key: "name", header: "Name" },
            { key: "tractor", header: "Tractor" },
            { key: "distance", header: "Distance" }
        ];
        this.state.rows = [];
    }

    updateComponent() {
        let newState = {
            rows: [
                {
                    id: "randomid1",
                    position: 1,
                    name: "Grant Barnes",
                    tractor: "Case 1030",
                    distance: 218.4
                },
                {
                    id: "randomid2",
                    position: 2,
                    name: "Frank Barnes",
                    tractor: "Farmall 450",
                    distance: 216.7
                },
                {
                    id: "randomid3",
                    position: 3,
                    name: "Brandon Barnes",
                    tractor: "Allis Chalmers WD45",
                    distance: 211.1
                },
                {
                    id: "randomid4",
                    position: 4,
                    name: "Grant Barnes",
                    tractor: "Case 1030",
                    distance: 196.4
                },
                {
                    id: "randomid5",
                    position: 5,
                    name: "Frank Barnes",
                    tractor: "Farmall 450",
                    distance: 196.2
                },
                {
                    id: "randomid6",
                    position: 6,
                    name: "Brandon Barnes",
                    tractor: "Allis Chalmers WD45",
                    distance: 194.5
                },
                {
                    id: "randomid7",
                    position: 7,
                    name: "Grant Barnes",
                    tractor: "Case 1030",
                    distance: 174.1
                },
                {
                    id: "randomid8",
                    position: 8,
                    name: "Frank Barnes",
                    tractor: "Farmall 450",
                    distance: 168.1
                },
                {
                    id: "randomid9",
                    position: 9,
                    name: "Brandon Barnes",
                    tractor: "Allis Chalmers WD45",
                    distance: 152.2
                },
                {
                    id: "randomid10",
                    position: 10,
                    name: "Grant Barnes",
                    tractor: "Case 1030",
                    distance: 152.1
                },
                {
                    id: "randomid11",
                    position: 11,
                    name: "Frank Barnes",
                    tractor: "Farmall 450",
                    distance: 149.3
                },
                {
                    id: "randomid12",
                    position: 12,
                    name: "Brandon Barnes",
                    tractor: "Allis Chalmers WD45",
                    distance: 148.4
                },
                {
                    id: "randomid13",
                    position: 13,
                    name: "Grant Barnes",
                    tractor: "Case 1030",
                    distance: 146.7
                },
                {
                    id: "randomid14",
                    position: 14,
                    name: "Frank Barnes",
                    tractor: "Farmall 450",
                    distance: 145.0
                },
                {
                    id: "randomid15",
                    position: 15,
                    name: "Brandon Barnes",
                    tractor: "Allis Chalmers WD45",
                    distance: 112.6
                },
                {
                    id: "randomid16",
                    position: 16,
                    name: "Grant Barnes",
                    tractor: "Case 1030",
                    distance: 94.6
                },
                {
                    id: "randomid17",
                    position: 17,
                    name: "Frank Barnes",
                    tractor: "Farmall 450",
                    distance: 64.1
                },
                {
                    id: "randomid18",
                    position: 18,
                    name: "Brandon Barnes",
                    tractor: "Allis Chalmers WD45",
                    distance: 32.8
                }
            ]
        };
        this.setState(newState);
    }

    componentWillMount() {
        super.componentWillMount();
        this.updateComponent();
    }

    componentDidUpdate(oldProps) {
        if (oldProps !== this.props) {
            this.updateComponent();
        }
    }

    doneMounting() {
        const search = this.props.location.search;
        if (!search) return;

        let newState = {};
        const params = search.split("&");
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
        this.setState(newState);
    }

    itemToString = item => {
        if (item) return item.display;
        return "";
    };

    getSelected = field => {
        const options = this.state[field + "Options"];
        for (let i in options) {
            if (options[i].id === this.state[field]) {
                return options[i];
            }
        }
        return { id: "", display: this.state[field] };
    };

    genResultsTable = () => {
        return (
            <DataTable
                rows={this.state.rows}
                headers={this.state.headers}
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
        return (
            <div className="contentContainer">
                <div className="contentRow">
                    <div className="thirdColumn paddingRight">
                        <Dropdown
                            id="seasons_dropdown"
                            label="Season"
                            titleText="Season"
                            light={false}
                            items={this.state.seasonOptions}
                            itemToString={this.itemToString}
                            selectedItem={this.getSelected("season")}
                            initialSelectedItem={this.getSelected("season")}
                            onChange={e => {
                                if (!e.selectedItem) {
                                    e.selectedItem = { id: "" };
                                }
                                this.setState({ season: e.selectedItem.id });
                            }}
                        />
                    </div>
                    <div className="thirdColumn paddingLeft paddingRight">
                        <Dropdown
                            id="pull_dropdown"
                            label="Pull"
                            titleText="Pull"
                            light={false}
                            items={this.state.pullOptions}
                            itemToString={this.itemToString}
                            selectedItem={this.getSelected("pull")}
                            initialSelectedItem={this.getSelected("pull")}
                            onChange={e => {
                                if (!e.selectedItem) {
                                    e.selectedItem = { id: "" };
                                }
                                this.setState({ pull: e.selectedItem.id });
                            }}
                        />
                    </div>
                    <div className="thirdColumn paddingLeft">
                        <Dropdown
                            id="class_dropdown"
                            label="Class"
                            titleText="Class"
                            light={false}
                            items={this.state.classOptions}
                            itemToString={this.itemToString}
                            selectedItem={this.getSelected("class")}
                            initialSelectedItem={this.getSelected("class")}
                            onChange={e => {
                                if (!e.selectedItem) {
                                    e.selectedItem = { id: "" };
                                }
                                this.setState({ class: e.selectedItem.id });
                            }}
                        />
                    </div>
                </div>
                <div className="contentRow">
                    <div className="tableScroll">{this.genResultsTable()}</div>
                </div>
            </div>
        );
    }
}

export default Results;
