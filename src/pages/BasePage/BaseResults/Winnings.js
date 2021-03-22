import React from "react";
import BaseResults from "../BaseResults";

class Percentiles extends BaseResults {
    winningsSort = (a, b) => {
        if (a.net < b.net) return 1;
        if (a.net > b.net) return -1;
        if (a.won < b.won) return 1;
        if (a.won > b.won) return -1;
        if (a.spent < b.spent) return 1;
        if (a.spent > b.spent) return -1;

        if (a.subject < b.subject) return -1;
        if (a.subject > b.subject) return 1;

        return 0;
    };

    getWinAmount = (pos, total) => {
        if (total < 2) return 0;
        if (pos > 4) return 0;
        switch (total) {
            case 2:
                switch (pos) {
                    case 1:
                        return 20;
                    default:
                        return 0;
                }
            case 3:
                switch (pos) {
                    case 1:
                        return 18;
                    case 2:
                        return 12;
                    default:
                        return 0;
                }
            case 4:
                switch (pos) {
                    case 1:
                        return 20;
                    case 2:
                        return 12;
                    case 3:
                        return 8;
                    default:
                        return 0;
                }
            default:
                return (5 - pos) * total;
        }
    };

    getWinnings = () => {
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

            const hookCount = obj.hooks.length;
            if (hookCount <= 1) continue;
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;

                const val = this.getHookVal(hook);
                if (!val) continue;

                if (!subjects[val]) {
                    subjects[val] = { spent: 0, won: 0 };
                }
                subjects[val].spent += 15;
                subjects[val].won += this.getWinAmount(
                    hook.position,
                    hookCount
                );
            }
        }

        let rows = [];
        for (let p in subjects) {
            let subject = this.state.allObjects[p];
            if (!subject) subject = p;
            rows.push({
                id: p,
                subject: this.getSubjectDisplay(subject),
                spent: subjects[p].spent,
                won: subjects[p].won,
                net: subjects[p].won - subjects[p].spent
            });
        }
        rows.sort(this.winningsSort);
        return rows;
    };

    getCellClass = (cell, row) => {
        if (cell.id.endsWith("net")) {
            const net = parseInt(cell.value);
            if (net > 0) return "greenText";
            return "redText";
        }
        return "";
    };

    titleRender() {
        return "Winnings";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                {this.genFilters(
                    this.getFiltered(),
                    ["season", "pull", "subject"],
                    {
                        Note:
                            "Values are estimated by typical payouts and $15 entry fees"
                    }
                )}
                <div className="contentRow">
                    {this.genDataTable(this.getWinnings(), [
                        { key: "subject", header: this.getSubjectHeader() },
                        { key: "spent", header: "Spent" },
                        { key: "won", header: "Won" },
                        { key: "net", header: "Net Gain" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Percentiles;
