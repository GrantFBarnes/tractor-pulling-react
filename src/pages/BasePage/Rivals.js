import React from "react";
import BasePage from "../BasePage";

class Rivals extends BasePage {
    rivalSort = (a, b) => {
        if (a.total < b.total) return 1;
        if (a.total > b.total) return -1;
        if (a.winsA < b.winsA) return 1;
        if (a.winsA > b.winsA) return -1;
        if (a.winsB < b.winsB) return 1;
        if (a.winsB > b.winsB) return -1;

        if (a.pullerA < b.pullerA) return -1;
        if (a.pullerA > b.pullerA) return 1;
        if (a.pullerB < b.pullerB) return -1;
        if (a.pullerB > b.pullerB) return 1;

        return 0;
    };

    getPullerDisplay = (puller, wins) => {
        return (
            puller.first_name +
            " " +
            puller.last_name +
            " - (" +
            wins +
            " Win" +
            (wins !== 1 ? "s" : "") +
            ")"
        );
    };

    getRivals = () => {
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

            let classPullers = [];
            let positions = {};
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                classPullers.push(hook.puller);
                positions[hook.puller] = hook.position;
            }

            for (let i = 0; i < classPullers.length - 1; i++) {
                for (let j = i + 1; j < classPullers.length; j++) {
                    const pullerA = classPullers[i];
                    const pullerB = classPullers[j];

                    let key = "";
                    if (pullerA > pullerB) {
                        key = pullerB + " " + pullerA;
                    } else {
                        key = pullerA + " " + pullerB;
                    }
                    if (!pullers[key]) {
                        pullers[key] = { winsA: 0, winsB: 0, total: 0 };
                    }

                    pullers[key].total++;
                    if (pullerA > pullerB) {
                        if (positions[pullerA] > positions[pullerB]) {
                            pullers[key].winsA++;
                        } else {
                            pullers[key].winsB++;
                        }
                    } else {
                        if (positions[pullerB] > positions[pullerA]) {
                            pullers[key].winsA++;
                        } else {
                            pullers[key].winsB++;
                        }
                    }
                }
            }
        }

        let rivals = [];
        for (let p in pullers) {
            const split = p.split(" ");
            let pullerA = this.state.allObjects[split[0]];
            let pullerB = this.state.allObjects[split[1]];
            if (pullers[p].winsA < pullers[p].winsB) {
                pullerA = this.state.allObjects[split[1]];
                pullerB = this.state.allObjects[split[0]];
                const temp = pullers[p].winsA;
                pullers[p].winsA = pullers[p].winsB;
                pullers[p].winsB = temp;
            }
            rivals.push({
                id: p,
                total: pullers[p].total,
                winsA: pullers[p].winsA,
                winsB: pullers[p].winsB,
                pullerA: this.getPullerDisplay(pullerA, pullers[p].winsA),
                pullerB: this.getPullerDisplay(pullerB, pullers[p].winsB)
            });
        }
        rivals.sort(this.rivalSort);
        return rivals;
    };

    titleRender() {
        return "Rivals";
    }

    contentRender() {
        const filtered = this.getFiltered();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull"])}
                <div className="contentRow">
                    <div className={this.getTableContainerClass()}>
                        {this.genDataTable(this.getRivals(), [
                            { key: "total", header: "Faceoffs" },
                            { key: "pullerA", header: "Puller" },
                            { key: "pullerB", header: "Puller" }
                        ])}
                    </div>
                </div>
            </div>
        );
    }
}

export default Rivals;
