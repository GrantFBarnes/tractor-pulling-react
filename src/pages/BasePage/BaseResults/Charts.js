import React from "react";
import BaseResults from "../BaseResults";

import { SimpleBarChart, PieChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

import "../../../styling/Charts.scss";

class Charts extends BaseResults {
    getPieChart = (data, height, x, y) => {
        return (
            <PieChart
                data={data}
                options={{
                    title: "Percentage of " + y + " by " + x,
                    resizeable: true,
                    height: height
                }}
            />
        );
    };

    getBarChart = (data, height, x, y) => {
        if (data.length && (data[data.length - 1].group = "Other")) {
            data = JSON.parse(JSON.stringify(data));
            data.pop();
        }
        return (
            <SimpleBarChart
                data={data}
                options={{
                    title: "Top 10 " + x + " for " + y,
                    axes: {
                        left: { mapsTo: "value" },
                        bottom: { mapsTo: "group", scaleType: "labels" }
                    },
                    height: height
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
        while (data.length > 11) {
            data[data.length - 2].group = "Other";
            data[data.length - 2].value =
                data[data.length - 2].value + data[data.length - 1].value;
            data.pop();
        }
        return data;
    };

    titleRender() {
        return "Charts";
    }

    getXName = () => {
        for (let i in this.subjectOptions) {
            if (this.subjectOptions[i].id !== this.state.subject) continue;
            return this.subjectOptions[i].display;
        }
        return "";
    };

    getYName = () => {
        for (let i in this.metricOptions) {
            if (this.metricOptions[i].id !== this.state.metric) continue;
            return this.metricOptions[i].display;
        }
        return "";
    };

    contentRender() {
        const data = this.getData();
        const height =
            Math.max(window.innerHeight, JSON.stringify(data).length) * 0.85 +
            "px";
        const x = this.getXName();
        const y = this.getYName();
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), [
                    "season",
                    "pull",
                    "subject",
                    "metric"
                ])}
                <div className="contentRow">
                    {this.getBarChart(data, height, x, y)}
                </div>
                <div className="contentRow">
                    {this.getPieChart(data, height, x, y)}
                </div>
            </div>
        );
    }
}

export default Charts;
