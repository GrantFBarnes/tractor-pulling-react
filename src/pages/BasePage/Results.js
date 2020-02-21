import React from "react";
import BasePage from "../BasePage";
import { Loading, Dropdown, Tab, Tabs } from "carbon-components-react";

import ResultsNav from "../../components/Results/ResultsNav";
import ResultsTable from "../../components/Results/ResultsTable";

class Results extends BasePage {
    constructor() {
        super();
        this.state.season = "";
        this.state.seasonOptions = [
            { id: "2020", display: "2020" },
            { id: "2019", display: "2019" },
            { id: "2018", display: "2018" }
        ];
        this.state.class = "";
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

    getSelectedSeason = () => {
        for (let i in this.state.seasonOptions) {
            if (this.state.seasonOptions[i].id === this.state.season) {
                return this.state.seasonOptions[i];
            }
        }
        return { id: "", display: this.state.season };
    };

    render() {
        return (
            <div className="pageContainer">
                {this.state.loading ? <Loading withOverlay={true} /> : null}
                <ResultsNav />
                <Dropdown
                    id="seasons_dropdown"
                    label="Season"
                    titleText="Season"
                    light={false}
                    items={this.state.seasonOptions}
                    itemToString={this.itemToString}
                    selectedItem={this.getSelectedSeason()}
                    initialSelectedItem={this.getSelectedSeason()}
                    onChange={e => {
                        if (!e.selectedItem) e.selectedItem = { id: "" };
                        this.setState({ season: e.selectedItem.id });
                    }}
                />
                {this.state.season ? (
                    <Tabs selected={0}>
                        <Tab label="4000 Farm">
                            <ResultsTable />
                        </Tab>
                        <Tab label="4000 Antique">
                            <ResultsTable />
                        </Tab>
                        <Tab label="4500 Farm">
                            <ResultsTable />
                        </Tab>
                        <Tab label="4500 Antique">
                            <ResultsTable />
                        </Tab>
                        <Tab label="5000 Farm">
                            <ResultsTable />
                        </Tab>
                        <Tab label="5000 Antique">
                            <ResultsTable />
                        </Tab>
                        <Tab label="5500 Farm">
                            <ResultsTable />
                        </Tab>
                        <Tab label="5500 Antique">
                            <ResultsTable />
                        </Tab>
                        <Tab label="6000 Farm">
                            <ResultsTable />
                        </Tab>
                        <Tab label="6000 Antique">
                            <ResultsTable />
                        </Tab>
                    </Tabs>
                ) : (
                    <div>
                        <br />
                        Please Select a Season
                    </div>
                )}
            </div>
        );
    }
}

export default Results;
