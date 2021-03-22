import React from "react";
import BaseResults from "../BaseResults";

class Percentiles extends BaseResults {
    percentileSort = (a, b) => {
        if (a.position < b.position) return 1;
        if (a.position > b.position) return -1;
        if (a.distance < b.distance) return 1;
        if (a.distance > b.distance) return -1;
        if (a.hooks < b.hooks) return 1;
        if (a.hooks > b.hooks) return -1;

        if (a.subject < b.subject) return -1;
        if (a.subject > b.subject) return 1;

        return 0;
    };

    getPercentiles = () => {
        let subjects = {};
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];

            if (this.state.category) {
                if (this.state.category !== obj.category) {
                    continue;
                }
            }

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
                    (hookCount - hook.position) / hookCount;

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
                position: parseInt(pos * 100),
                distance: parseInt(dist * 100),
                hooks: subjects[p].hooks
            });
        }
        percentiles.sort(this.percentileSort);
        return percentiles;
    };

    getCellClass = (cell, row) => {
        if (cell.id.endsWith("position") || cell.id.endsWith("distance")) {
            if (cell.value >= 75) return "greenText";
            if (cell.value >= 50) return "yellowText";
            if (cell.value >= 25) return "orangeText";
            return "redText";
        }
        return "";
    };

    titleRender() {
        return "Percentiles";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), [
                    "season",
                    "pull",
                    "subject",
                    "category",
                    "excel",
                    "youtube"
                ])}
                <div className="contentRow">
                    {this.genDataTable(this.getPercentiles(), [
                        { key: "subject", header: this.getSubjectHeader() },
                        { key: "position", header: "Position (%)" },
                        { key: "distance", header: "Distance (%)" },
                        { key: "hooks", header: "Total Hooks" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Percentiles;
