import React from "react";
import BaseResults from "../BaseResults";

class Rivals extends BaseResults {
    rivalSort = (a, b) => {
        if (a.winsA < b.winsA) return 1;
        if (a.winsA > b.winsA) return -1;
        if (a.winsB < b.winsB) return 1;
        if (a.winsB > b.winsB) return -1;

        if (a.subjectA < b.subjectA) return -1;
        if (a.subjectA > b.subjectA) return 1;
        if (a.subjectB < b.subjectB) return -1;
        if (a.subjectB > b.subjectB) return 1;

        return 0;
    };

    getRivals = () => {
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

            let classSubjects = [];
            let positions = {};
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
                classSubjects.push(val);
                positions[val] = hook.position;
            }

            for (let i = 0; i < classSubjects.length - 1; i++) {
                for (let j = i + 1; j < classSubjects.length; j++) {
                    const subjectA = classSubjects[i];
                    const subjectB = classSubjects[j];
                    if (subjectA === subjectB) continue;

                    let key = "";
                    if (subjectA > subjectB) {
                        key = subjectB + "." + subjectA;
                    } else {
                        key = subjectA + "." + subjectB;
                    }
                    if (!subjects[key]) {
                        subjects[key] = { winsA: 0, winsB: 0 };
                    }

                    if (subjectA > subjectB) {
                        if (positions[subjectA] > positions[subjectB]) {
                            subjects[key].winsA++;
                        } else {
                            subjects[key].winsB++;
                        }
                    } else {
                        if (positions[subjectB] > positions[subjectA]) {
                            subjects[key].winsA++;
                        } else {
                            subjects[key].winsB++;
                        }
                    }
                }
            }
        }

        let rivals = [];
        for (let p in subjects) {
            const split = p.split(".");
            let subjectA = "";
            let subjectB = "";
            if (this.state.allObjects[split[0]]) {
                subjectA = this.state.allObjects[split[0]];
                subjectB = this.state.allObjects[split[1]];
                if (subjects[p].winsA < subjects[p].winsB) {
                    subjectA = this.state.allObjects[split[1]];
                    subjectB = this.state.allObjects[split[0]];
                }
            } else {
                subjectA = split[0];
                subjectB = split[1];
                if (subjects[p].winsA < subjects[p].winsB) {
                    subjectA = split[1];
                    subjectB = split[0];
                }
            }
            if (subjects[p].winsA < subjects[p].winsB) {
                const temp = subjects[p].winsA;
                subjects[p].winsA = subjects[p].winsB;
                subjects[p].winsB = temp;
            }
            rivals.push({
                id: p,
                winsA: subjects[p].winsA,
                winsB: subjects[p].winsB,
                subjectA: this.getSubjectDisplay(subjectA),
                subjectB: this.getSubjectDisplay(subjectB)
            });
        }
        rivals.sort(this.rivalSort);
        return rivals;
    };

    getCellClass = (cell, row) => {
        const winsA = row.cells[0].value;
        const winsB = row.cells[3].value;
        const gap = (winsA - winsB) / (winsA + winsB);

        if (gap === 0) return "";
        if (cell.id.endsWith("A")) {
            if (gap >= 0.5) return "greenText";
            return "yellowText";
        } else if (cell.id.endsWith("B")) {
            if (gap >= 0.5) return "redText";
            return "orangeText";
        }
        return "";
    };

    titleRender() {
        return "Rivals";
    }

    contentRender() {
        const header = this.getSubjectHeader();
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), [
                    "season",
                    "pull",
                    "subject",
                    "youtube"
                ])}
                <div className="contentRow">
                    {this.genDataTable(this.getRivals(), [
                        { key: "winsA", header: "Wins" },
                        { key: "subjectA", header: header },
                        { key: "subjectB", header: header },
                        { key: "winsB", header: "Wins" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Rivals;
