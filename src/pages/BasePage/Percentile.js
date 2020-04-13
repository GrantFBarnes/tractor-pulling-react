import React from "react";
import BasePage from "../BasePage";

class Percentile extends BasePage {
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
        return dropdowns;
    };

    genLargeWinFilters = filtered => {
        return (
            <div className="contentRow">
                <div className="halfColumn paddingRight">
                    {filtered.seasons.length > 1
                        ? this.genSeasonDropdown(filtered)
                        : null}
                </div>
                <div className="halfColumn paddingLeft">
                    {filtered.pulls.length > 1
                        ? this.genPullDropdown(filtered)
                        : null}
                </div>
            </div>
        );
    };

    percentileSort = (a, b) => {
        if (a.percentile < b.percentile) return 1;
        if (a.percentile > b.percentile) return -1;
        if (a.hooks < b.hooks) return 1;
        if (a.hooks > b.hooks) return -1;

        if (a.puller < b.puller) return -1;
        if (a.puller > b.puller) return 1;

        return 0;
    };

    getPercentiles = () => {
        let pullers = {};
        for (let id in this.state.allObjects) {
            const obj = this.state.allObjects[id];
            if (obj.type !== "Class") continue;

            const pull = this.state.allObjects[obj.pull];
            if (!pull) continue;

            if (this.state.pull) {
                if (obj.pull !== this.state.pull) {
                    continue;
                }
            }

            if (this.state.season) {
                if (pull.season !== this.state.season) {
                    continue;
                }
            }

            const hookCount = obj.hooks.length;
            if (hookCount <= 1) continue;
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                if (!hook.puller) continue;
                if (!pullers[hook.puller]) {
                    pullers[hook.puller] = { hooks: 0, sum: 0 };
                }
                pullers[hook.puller].hooks++;
                pullers[hook.puller].sum =
                    pullers[hook.puller].sum +
                    (hookCount - hook.position) / (hookCount - 1);
            }
        }

        let percentiles = [];
        for (let p in pullers) {
            const puller = this.state.allObjects[p];
            const percentile = pullers[p].sum / pullers[p].hooks;
            percentiles.push({
                id: p,
                puller: puller.first_name + " " + puller.last_name,
                percentile: percentile,
                percent: parseInt(percentile * 100) + "%",
                hooks: pullers[p].hooks
            });
        }
        percentiles.sort(this.percentileSort);
        return percentiles;
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
                        {this.genDataTable(this.getPercentiles(), [
                            { key: "puller", header: "Puller" },
                            { key: "percent", header: "Percentile" },
                            { key: "hooks", header: "Total Hooks" }
                        ])}
                    </div>
                </div>
            </div>
        );
    }
}

export default Percentile;
