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

        if (a.subjectA < b.subjectA) return -1;
        if (a.subjectA > b.subjectA) return 1;
        if (a.subjectB < b.subjectB) return -1;
        if (a.subjectB > b.subjectB) return 1;

        return 0;
    };

    getSubjectDisplaySecond = wins => {
        return " - (" + wins + " Win" + (wins !== 1 ? "s" : "") + ")";
    };

    getRivals = () => {
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

            let classSubjects = [];
            let positions = {};
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                let val = hook[this.state.subject];
                if (this.state.subject === "brand") {
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
                        subjects[key] = { winsA: 0, winsB: 0, total: 0 };
                    }

                    subjects[key].total++;
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
                total: subjects[p].total,
                winsA: subjects[p].winsA,
                winsB: subjects[p].winsB,
                subjectA:
                    this.getSubjectDisplay(subjectA) +
                    this.getSubjectDisplaySecond(subjects[p].winsA),
                subjectB:
                    this.getSubjectDisplay(subjectB) +
                    this.getSubjectDisplaySecond(subjects[p].winsB)
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
        const header = this.getSubjectHeader();
        return (
            <div className="contentContainer">
                {this.genFilters(filtered, ["season", "pull", "subject"])}
                <div className="contentRow">
                    <div className={this.getTableContainerClass()}>
                        {this.genDataTable(this.getRivals(), [
                            { key: "total", header: "Faceoffs" },
                            { key: "subjectA", header: header },
                            { key: "subjectB", header: header }
                        ])}
                    </div>
                </div>
            </div>
        );
    }
}

export default Rivals;
