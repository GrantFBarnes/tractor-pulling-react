import React from "react";
import BaseResults from "../BaseResults";

class Wins extends BaseResults {
    WinSort = (a, b) => {
        if (a.wins < b.wins) return 1;
        if (a.wins > b.wins) return -1;

        if (a.class < b.class) return -1;
        if (a.class > b.class) return 1;
        if (a.puller < b.puller) return -1;
        if (a.puller > b.puller) return 1;

        return 0;
    };

    getWins = () => {
        let pullers = {};
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];

            const pull = this.state.allObjects[obj.pull];
            if (!pull) continue;

            if (this.state.season) {
                if (pull.season !== this.state.season) {
                    continue;
                }
            }

            const classType = this.getClassType(id);
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                if (!hook.puller) continue;
                if (hook.position !== 1) continue;
                if (!pullers[hook.puller]) {
                    pullers[hook.puller] = {};
                }
                if (!pullers[hook.puller][classType]) {
                    pullers[hook.puller][classType] = 0;
                }
                pullers[hook.puller][classType]++;
            }
        }

        let wins = [];
        for (let p in pullers) {
            const puller = this.state.allObjects[p];
            if (!puller) continue;
            for (let c in pullers[p]) {
                wins.push({
                    id: p + c,
                    puller: this.getSubjectDisplay(puller),
                    class: c,
                    wins: pullers[p][c]
                });
            }
        }
        wins.sort(this.WinSort);
        return wins;
    };

    getCellClass = (cell, row) => {
        if (!cell.id.endsWith("wins")) return "";
        if (cell.value >= 7) return "greenText";
        if (cell.value >= 5) return "yellowText";
        if (cell.value >= 3) return "orangeText";
        return "redText";
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
                        { key: "wins", header: "Wins" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Wins;
