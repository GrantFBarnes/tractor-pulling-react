import React from "react";
import BaseResults from "../BaseResults";

class Distances extends BaseResults {
    distanceSort = (a, b) => {
        if (a.average < b.average) return 1;
        if (a.average > b.average) return -1;
        if (a.total < b.total) return 1;
        if (a.total > b.total) return -1;

        if (a.subject < b.subject) return -1;
        if (a.subject > b.subject) return 1;

        return 0;
    };

    getDistances = () => {
        let subjects = {};
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];

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

                let val = hook[this.state.subject];
                if (this.state.subject === "combo") {
                    if (!hook.puller) continue;
                    if (!hook.tractor) continue;
                    val = hook.puller + " " + hook.tractor;
                } else if (this.state.subject === "brand") {
                    const tractor = this.state.allObjects[hook.tractor];
                    if (!tractor) continue;
                    val = tractor.brand;
                }
                if (!val) continue;

                if (!subjects[val]) {
                    subjects[val] = { hooks: 0, sum: 0 };
                }
                subjects[val].hooks++;
                subjects[val].sum = subjects[val].sum + hook.distance;
            }
        }

        let distances = [];
        for (let p in subjects) {
            let subject = this.state.allObjects[p];
            if (!subject) subject = p;
            const average = subjects[p].sum / subjects[p].hooks;
            distances.push({
                id: p,
                subject: this.getSubjectDisplay(subject),
                average: average,
                averageDisplay: parseInt(average) + " ft",
                total: subjects[p].sum,
                totalDisplay: parseInt(subjects[p].sum) + " ft",
                hooks: subjects[p].hooks
            });
        }
        distances.sort(this.distanceSort);
        return distances;
    };

    titleRender() {
        return "Distances";
    }

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull", "subject"])}
                <div className="contentRow">
                    {this.genDataTable(this.getDistances(), [
                        { key: "subject", header: this.getSubjectHeader() },
                        { key: "averageDisplay", header: "Average" },
                        { key: "totalDisplay", header: "Total" },
                        { key: "hooks", header: "Total Hooks" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Distances;
