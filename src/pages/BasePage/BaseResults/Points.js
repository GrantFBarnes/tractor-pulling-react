import React from "react";
import BaseResults from "../BaseResults";

class Points extends BaseResults {
    titleRender() {
        return "Points";
    }

    pointSort = (a, b) => {
        if (a.points < b.points) return 1;
        if (a.points > b.points) return -1;

        if (a.puller < b.puller) return -1;
        if (a.puller > b.puller) return 1;

        return 0;
    };

    getInnerRows = data => {
        let points = [];
        for (let p in data.pullers) {
            const puller = this.state.allObjects[p];
            if (!puller) continue;
            points.push({
                id: p,
                puller: this.getSubjectDisplay(puller),
                points: data.pullers[p]
            });
        }
        points.sort(this.pointSort);
        return points;
    };

    getInnerHeaders = () => {
        return [
            { key: "puller", header: "Puller" },
            { key: "points", header: "Points" }
        ];
    };

    classPointSort = (a, b) => {
        const classA = this.state.allObjects[a.id];
        const classB = this.state.allObjects[b.id];
        return this.classSort(classA, classB);
    };

    getPoints = position => {
        let points = 0;
        if (position <= 10) points = 11 - position;
        points += 5;
        return points;
    };

    getClassPoints = () => {
        let classes = {};
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];
            if (obj.weight % 250 !== 0) continue;

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

                if (!classes[classType]) {
                    classes[classType] = {
                        id: id,
                        class: classType,
                        pullers: {}
                    };
                }
                if (!classes[classType].pullers[hook.puller]) {
                    classes[classType].pullers[hook.puller] = 0;
                }
                classes[classType].pullers[hook.puller] += this.getPoints(
                    hook.position
                );
            }
        }

        let classPoints = [];
        for (let c in classes) {
            let leaders = [];
            let points = 0;
            for (let p in classes[c].pullers) {
                if (classes[c].pullers[p] > points) {
                    leaders = [];
                    points = classes[c].pullers[p];
                }
                if (classes[c].pullers[p] >= points) {
                    leaders.push(
                        this.getSubjectDisplay(this.state.allObjects[p])
                    );
                }
            }
            classPoints.push({
                leaders: leaders.toString(),
                points: points,
                ...classes[c]
            });
        }
        classPoints.sort(this.classPointSort);
        return classPoints;
    };

    pointLink = () => {
        return (
            <a
                href="http://natpa.club/wp-content/uploads/2020/08/NATPA-POINT-SYSTEM2020.pdf"
                target="_blank"
            >
                NATPA Point System
            </a>
        );
    };

    contentRender() {
        const rows = this.getClassPoints();
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), ["season"], {
                    "Points Calculation": this.pointLink()
                })}

                <div className="contentRow">
                    {this.genExpandTable(rows, [
                        { key: "class", header: "Class" },
                        { key: "leaders", header: "Leaders" },
                        { key: "points", header: "Points" }
                    ])}
                </div>
            </div>
        );
    }
}

export default Points;
