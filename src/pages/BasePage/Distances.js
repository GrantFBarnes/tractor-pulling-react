import React from "react";
import BasePage from "../BasePage";

class Distances extends BasePage {
    distanceSort = (a, b) => {
        if (a.average < b.average) return 1;
        if (a.average > b.average) return -1;
        if (a.total < b.total) return 1;
        if (a.total > b.total) return -1;

        if (a.puller < b.puller) return -1;
        if (a.puller > b.puller) return 1;

        return 0;
    };

    getDistances = () => {
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

            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                if (!hook.puller) continue;
                if (!pullers[hook.puller]) {
                    pullers[hook.puller] = { hooks: 0, sum: 0 };
                }
                pullers[hook.puller].hooks++;
                pullers[hook.puller].sum =
                    pullers[hook.puller].sum + hook.distance;
            }
        }

        let distances = [];
        for (let p in pullers) {
            const puller = this.state.allObjects[p];
            const average = pullers[p].sum / pullers[p].hooks;
            distances.push({
                id: p,
                puller: puller.first_name + " " + puller.last_name,
                average: average,
                averageDisplay: parseInt(average) + " ft",
                total: pullers[p].sum,
                totalDisplay: parseInt(pullers[p].sum) + " ft",
                hooks: pullers[p].hooks
            });
        }
        distances.sort(this.distanceSort);
        return distances;
    };

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull"])}
                <div className="contentRow">
                    <div className={this.getTableContainerClass()}>
                        {this.genDataTable(this.getDistances(), [
                            { key: "puller", header: "Puller" },
                            { key: "averageDisplay", header: "Average" },
                            { key: "totalDisplay", header: "Total" },
                            { key: "hooks", header: "Total Hooks" }
                        ])}
                    </div>
                </div>
            </div>
        );
    }
}

export default Distances;
