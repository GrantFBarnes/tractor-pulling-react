import React from "react";
import BaseResults from "../BaseResults";

class Wins extends BaseResults {
    getCellClass = (cell, row) => {
        const id = cell.id.toLowerCase();
        if (id.endsWith("wins")) {
            if (cell.value >= 7) return "greenText";
            if (cell.value >= 5) return "yellowText";
            if (cell.value >= 3) return "orangeText";
            return "redText";
        } else if (id.endsWith("percent")) {
            const percent = cell.value.split("%")[0];
            if (percent >= 55) return "greenText";
            if (percent >= 40) return "yellowText";
            if (percent >= 20) return "orangeText";
            return "redText";
        }
        return "";
    };

    titleRender() {
        return "Wins";
    }

    winSort = (a, b) => {
        if (a.wins < b.wins) return 1;
        if (a.wins > b.wins) return -1;

        const percentA = parseInt(a.classPercent.split("%")[0]);
        const percentB = parseInt(b.classPercent.split("%")[0]);
        if (percentA < percentB) return 1;
        if (percentA > percentB) return -1;

        if (a.puller < b.puller) return -1;
        if (a.puller > b.puller) return 1;

        return 0;
    };

    getInnerRows = data => {
        let wins = [];
        for (let p in data.pullers) {
            const puller = this.state.allObjects[p];
            if (!puller) continue;
            const classPercent = data.pullers[p] / data.pulled;
            const pullPercent = data.pullers[p] / data.pulls;
            wins.push({
                id: p,
                puller: this.getSubjectDisplay(puller),
                wins: data.pullers[p],
                classPercent: parseInt(classPercent * 100) + "%",
                pullPercent: parseInt(pullPercent * 100) + "%"
            });
        }
        wins.sort(this.winSort);
        return wins;
    };

    getInnerHeaders = () => {
        return [
            { key: "puller", header: "Puller" },
            { key: "wins", header: "Wins" },
            { key: "classPercent", header: "Win % Over Class Pulled" },
            { key: "pullPercent", header: "Win % Over All Pulls" }
        ];
    };

    classWinSort = (a, b) => {
        const classA = this.state.allObjects[a.id];
        const classB = this.state.allObjects[b.id];
        return this.classSort(classA, classB);
    };

    getClassWins = () => {
        let classes = {};
        let pulls = new Set();
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];

            const pull = this.state.allObjects[obj.pull];
            if (!pull) continue;

            if (this.state.season) {
                if (pull.season !== this.state.season) {
                    continue;
                }
            }

            pulls.add(obj.pull);

            const classType = this.getClassType(id);
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                if (!hook.puller) continue;
                if (hook.position !== 1) continue;

                if (!classes[classType]) {
                    classes[classType] = {
                        id: id,
                        class: classType,
                        pulled: 0,
                        pullers: {}
                    };
                }
                if (!classes[classType].pullers[hook.puller]) {
                    classes[classType].pullers[hook.puller] = 0;
                }
                classes[classType].pullers[hook.puller]++;
                classes[classType].pulled++;
            }
        }

        let classWins = [];
        for (let c in classes) {
            let pullerCount = 0;
            let wins = 0;
            let leaders = [];
            for (let p in classes[c].pullers) {
                pullerCount++;
                if (classes[c].pullers[p] > wins) {
                    wins = classes[c].pullers[p];
                    leaders = [];
                }
                if (classes[c].pullers[p] >= wins) {
                    leaders.push(
                        this.getSubjectDisplay(this.state.allObjects[p])
                    );
                }
            }
            classWins.push({
                wins: wins,
                leaders: leaders.toString(),
                pullerCount: pullerCount,
                pulls: pulls.size,
                ...classes[c]
            });
        }
        classWins.sort(this.classWinSort);
        return classWins;
    };

    contentRender() {
        const rows = this.getClassWins();
        let pullCount = 0;
        for (let i in rows) {
            pullCount = rows[i].pulls;
            break;
        }
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), ["season"], {
                    Pulls: pullCount
                })}
                <div className="contentRow">
                    {this.genExpandTable(rows, [
                        { key: "class", header: "Class" },
                        { key: "wins", header: "Wins" },
                        { key: "leaders", header: "Leaders" },
                        { key: "pullerCount", header: "Pullers Who Won" },
                        { key: "pulled", header: "Times Pulled" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Wins;
