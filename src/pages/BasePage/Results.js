import React from "react";
import BasePage from "../BasePage";

class Results extends BasePage {
    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull", "class"])}
                <div className="contentRow">
                    <div className={this.getTableContainerClass()}>
                        {filtered.hooks.length ? (
                            this.genDataTable(filtered.hooks, [
                                { key: "position", header: "Pos" },
                                { key: "puller", header: "Puller" },
                                { key: "tractor", header: "Tractor" },
                                { key: "distance", header: "Distance" }
                            ])
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
