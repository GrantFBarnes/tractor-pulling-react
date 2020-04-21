import React from "react";
import BaseResults from "../BaseResults";

import { SimpleBarChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

import "../../../styling/Charts.scss";

class Charts extends BaseResults {
    getBarChart = (data, title) => {
        const height = 450 + data.length * 10;
        return (
            <SimpleBarChart
                data={data}
                options={{
                    title: title,
                    axes: {
                        left: { mapsTo: "value" },
                        bottom: { mapsTo: "group", scaleType: "labels" }
                    },
                    height: height + "px"
                }}
            />
        );
    };

    dataSort = (a, b) => {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;

        if (a.group < b.group) return -1;
        if (a.group > b.group) return 1;

        return 0;
    };

    getSubjectVal = hook => {
        const puller = this.state.allObjects[hook.puller];
        const tractor = this.state.allObjects[hook.tractor];
        switch (this.state.subject) {
            case "puller":
                if (puller) return puller.first_name + " " + puller.last_name;
                break;

            case "combo":
                if (puller && tractor) {
                    return (
                        puller.first_name +
                        " " +
                        puller.last_name +
                        " - " +
                        tractor.brand +
                        " " +
                        tractor.model
                    );
                }
                break;

            case "tractor":
                if (tractor) return tractor.brand + " " + tractor.model;
                break;

            case "brand":
                if (tractor) return tractor.brand;
                break;

            default:
                break;
        }
        return null;
    };

    getMeticVal = hook => {
        switch (this.state.metric) {
            case "wins":
                if (hook.position === 1) return 1;
                break;
            case "hooks":
                return 1;
            case "distance":
                return hook.distance;
            default:
                break;
        }
        return 0;
    };

    getData = () => {
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

                const val = this.getSubjectVal(hook);
                if (!val) continue;

                if (!subjects[val]) subjects[val] = 0;
                subjects[val] = subjects[val] + this.getMeticVal(hook);
            }
        }

        let data = [];
        for (let x in subjects) {
            if (!subjects[x]) continue;
            data.push({ group: x, value: subjects[x] });
        }
        data.sort(this.dataSort);
        while (data.length > 20) {
            data[data.length - 2].group = "Other";
            data[data.length - 2].value =
                data[data.length - 2].value + data[data.length - 1].value;
            data.pop();
        }
        return data;
    };

    getTitle = () => {
        let title = "";
        for (let i in this.metricOptions) {
            if (this.metricOptions[i].id !== this.state.metric) continue;
            title += this.metricOptions[i].display;
            break;
        }
        title += " by ";
        for (let i in this.subjectOptions) {
            if (this.subjectOptions[i].id !== this.state.subject) continue;
            title += this.subjectOptions[i].display;
            break;
        }
        return title;
    };

    titleRender() {
        return "Charts";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), [
                    "season",
                    "pull",
                    "subject",
                    "metric"
                ])}
                <div className="contentRow">
                    {this.getBarChart(this.getData(), this.getTitle())}
                </div>
            </div>
        );
    }
}

export default Charts;
