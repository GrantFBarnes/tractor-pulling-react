import React from "react";
import BaseResults from "../BaseResults";

class Wins extends BaseResults {
    WinSort = (a, b) => {
        if (a.wins < b.wins) return 1;
        if (a.wins > b.wins) return -1;

        const percentA = parseInt(a.percent.split("%")[0]);
        const percentB = parseInt(b.percent.split("%")[0]);
        if (percentA < percentB) return 1;
        if (percentA > percentB) return -1;

        if (a.class < b.class) return -1;
        if (a.class > b.class) return 1;
        if (a.puller < b.puller) return -1;
        if (a.puller > b.puller) return 1;

        return 0;
    };

    getWins = () => {
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
                    classes[classType] = { total: 0 };
                }
                if (!classes[classType][hook.puller]) {
                    classes[classType][hook.puller] = 0;
                }
                classes[classType][hook.puller]++;
                classes[classType]["total"]++;
            }
        }

        let wins = [];
        for (let c in classes) {
            for (let p in classes[c]) {
                const puller = this.state.allObjects[p];
                if (!puller) continue;
                const percent = classes[c][p] / classes[c]["total"];
                const ppercent = classes[c][p] / pulls.size;
                wins.push({
                    id: p + c,
                    puller: this.getSubjectDisplay(puller),
                    class: c,
                    wins: classes[c][p],
                    percent: parseInt(percent * 100) + "%",
                    ppercent: parseInt(ppercent * 100) + "%"
                });
            }
        }
        wins.sort(this.WinSort);
        return wins;
    };

    getCellClass = (cell, row) => {
        if (cell.id.endsWith("wins")) {
            if (cell.value >= 7) return "greenText";
            if (cell.value >= 5) return "yellowText";
            if (cell.value >= 3) return "orangeText";
            return "redText";
        } else if (cell.id.endsWith("percent")) {
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

    contentRender() {
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), ["season"])}
                <div className="contentRow">
                    {this.genDataTable(this.getWins(), [
                        { key: "puller", header: "Puller" },
                        { key: "class", header: "Class" },
                        { key: "wins", header: "Wins" },
                        { key: "percent", header: "Win % Over Classes" },
                        { key: "ppercent", header: "Win % Over Pulls" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Wins;
