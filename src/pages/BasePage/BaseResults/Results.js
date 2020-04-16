import React from "react";
import BaseResults from "../BaseResults";

class Results extends BaseResults {
    titleRender() {
        return "Results";
    }

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull", "class"])}
                <div className="contentRow">
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
                                Please select a class from filters above to see
                                results
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Results;
