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

        if (a.subject < b.subject) return -1;
        if (a.subject > b.subject) return 1;

        return 0;
    };

    getHookVal = hook => {
        if (hook[this.state.subject]) return hook[this.state.subject];
        if (this.state.subject === "brand") {
            const tractor = this.state.allObjects[hook.tractor];
            if (tractor && tractor.brand) return tractor.brand;
        }
        return null;
    };

    getPercentiles = () => {
        let subjects = {};
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

                const val = this.getHookVal(hook);
                if (!val) continue;

                if (!subjects[val]) {
                    subjects[val] = {
                        hooks: 0,
                        position_sum: 0,
                        distance_sum: 0
                    };
                }
                subjects[val].hooks++;
                subjects[val].position_sum =
                    subjects[val].position_sum +
                    (hookCount - hook.position) / (hookCount - 1);

                if (hook.distance > maxDistance) maxDistance = hook.distance;
            }

            if (!maxDistance) continue;
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;

                const val = this.getHookVal(hook);
                if (!val) continue;

                subjects[val].distance_sum =
                    subjects[val].distance_sum + hook.distance / maxDistance;
            }
        }

        let percentiles = [];
        for (let p in subjects) {
            let subject = this.state.allObjects[p];
            if (!subject) subject = p;
            const pos = subjects[p].position_sum / subjects[p].hooks;
            const dist = subjects[p].distance_sum / subjects[p].hooks;
            percentiles.push({
                id: p,
                subject: this.getSubjectDisplay(subject),
                pos: pos,
                position: parseInt(pos * 100) + "%",
                dist: dist,
                distance: parseInt(dist * 100) + "%",
                hooks: subjects[p].hooks
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
                {this.genFilters(filtered, ["season", "pull", "subject"])}
                <div className="contentRow">
                    <div className={this.getTableContainerClass()}>
                        {this.genDataTable(this.getPercentiles(), [
                            { key: "subject", header: this.getSubjectHeader() },
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
