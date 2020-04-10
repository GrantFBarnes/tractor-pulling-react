import React from "react";
import BasePage from "../BasePage";

class Results extends BasePage {
    genSmallWinFilters = filtered => {
        let dropdowns = [];
        if (filtered.seasons.length > 1) {
            dropdowns.push(
                <div key="seasonRow" className="contentRow">
                    {this.genSeasonDropdown(filtered)}
                </div>
            );
        }
        if (filtered.pulls.length > 1) {
            dropdowns.push(
                <div key="pullRow" className="contentRow">
                    {this.genPullDropdown(filtered)}
                </div>
            );
        }
        if (filtered.classes.length > 1) {
            dropdowns.push(
                <div key="classRow" className="contentRow">
                    {this.genClassDropdown(filtered)}
                </div>
            );
        }
        return dropdowns;
    };

    genLargeWinFilters = filtered => {
        return (
            <div className="contentRow">
                <div className="thirdColumn paddingRight">
                    {filtered.seasons.length > 1
                        ? this.genSeasonDropdown(filtered)
                        : null}
                </div>
                <div className="thirdColumn paddingLeft paddingRight">
                    {filtered.pulls.length > 1
                        ? this.genPullDropdown(filtered)
                        : null}
                </div>
                <div className="thirdColumn paddingLeft">
                    {filtered.classes.length > 1
                        ? this.genClassDropdown(filtered)
                        : null}
                </div>
            </div>
        );
    };

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.state.smallWindow
                    ? this.genSmallWinFilters(filtered)
                    : this.genLargeWinFilters(filtered)}
                <div className="contentRow">
                    <div
                        className={
                            "tableContainer " +
                            (this.state.sideExpanded
                                ? "tableContainerSideExpanded"
                                : "tableContainerSideCollapsed")
                        }
                    >
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
