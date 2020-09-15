import React from "react";
import BaseResults from "../BaseResults";

class Results extends BaseResults {
    titleRender() {
        return "Results";
    }

    getInnerRows = data => {
        let hooks = [];
        for (let h in data.hooks) {
            const id = data.hooks[h];
            const hook = this.state.allObjects[id];
            if (!hook) continue;
            const puller = this.state.allObjects[hook.puller];
            if (!puller) continue;
            const tractor = this.state.allObjects[hook.tractor];
            if (!tractor) continue;
            hooks.push({
                id: id,
                position: hook.position,
                puller: puller.first_name + " " + puller.last_name,
                tractor: tractor.brand + " " + tractor.model,
                distance: hook.distance
            });
        }
        hooks.sort(this.hookSort);
        return hooks;
    };

    getInnerHeaders = () => {
        return [
            { key: "position", header: "Pos" },
            { key: "puller", header: "Puller" },
            { key: "tractor", header: "Tractor" },
            { key: "distance", header: "Distance" }
        ];
    };

    resultSort = (a, b) => {
        const classA = this.state.allObjects[a.id];
        const classB = this.state.allObjects[b.id];
        return this.classSort(classA, classB);
    };

    getResults = () => {
        let results = [];
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

            results.push({
                id: id,
                class: this.getClassType(id),
                hookCount: obj.hooks.length,
                hooks: obj.hooks
            });
        }
        results.sort(this.resultSort);
        return results;
    };

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull"])}
                <div className="contentRow">
                    {filtered.classes.length > 1 ? (
                        this.genExpandTable(this.getResults(), [
                            { key: "class", header: "Class" },
                            { key: "hookCount", header: "Hooks" }
                        ])
                    ) : (
                        <div>
                            <br />
                            <p className="center">
                                Select a pull from filters above to see results
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Results;
