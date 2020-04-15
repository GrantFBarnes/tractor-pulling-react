import React from "react";
import BasePage from "../BasePage";

class Percentile extends BasePage {
    percentileSort = (a, b) => {
        if (a.pos < b.pos) return 1;
        if (a.pos > b.pos) return -1;
        if (a.dist < b.dist) return 1;
        if (a.dist > b.dist) return -1;
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
            let maxDistance = 0;
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                if (!hook.puller) continue;
                if (!pullers[hook.puller]) {
                    pullers[hook.puller] = {
                        hooks: 0,
                        position_sum: 0,
                        distance_sum: 0
                    };
                }
                pullers[hook.puller].hooks++;
                pullers[hook.puller].position_sum =
                    pullers[hook.puller].position_sum +
                    (hookCount - hook.position) / (hookCount - 1);

                if (hook.distance > maxDistance) maxDistance = hook.distance;
            }

            if (!maxDistance) continue;
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                if (!hook.puller) continue;

                pullers[hook.puller].distance_sum =
                    pullers[hook.puller].distance_sum +
                    hook.distance / maxDistance;
            }
        }

        let percentiles = [];
        for (let p in pullers) {
            const puller = this.state.allObjects[p];
            const pos = pullers[p].position_sum / pullers[p].hooks;
            const dist = pullers[p].distance_sum / pullers[p].hooks;
            percentiles.push({
                id: p,
                puller: puller.first_name + " " + puller.last_name,
                pos: pos,
                position: parseInt(pos * 100) + "%",
                dist: dist,
                distance: parseInt(dist * 100) + "%",
                hooks: pullers[p].hooks
            });
        }
        percentiles.sort(this.percentileSort);
        return percentiles;
    };

    titleRender() {
        return "Percentile";
    }

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull"])}
                <div className="contentRow">
                    <div className={this.getTableContainerClass()}>
                        {this.genDataTable(this.getPercentiles(), [
                            { key: "puller", header: "Puller" },
                            { key: "position", header: "Position" },
                            { key: "distance", header: "Distance" },
                            { key: "hooks", header: "Total Hooks" }
                        ])}
                    </div>
                </div>
            </div>
        );
    }
}

export default Percentile;
