import React from "react";
import Analysis from "../Analysis";

import { LineChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

import "../../../../styling/Charts.scss";

class Pullers extends Analysis {
    getLineChart = (data, x, y) => {
        if (!data.length) return "No data, choose a different Season or Puller";
        return (
            <LineChart
                data={data}
                options={{
                    title: "Position Percentile Over Time By Tractor",
                    axes: {
                        bottom: { mapsTo: "date", scaleType: "time" },
                        left: { mapsTo: "value", scaleType: "linear" }
                    },
                    height: "350px"
                }}
            />
        );
    };

    getDisplay = tractor_id => {
        const tractor = this.state.allObjects[tractor_id];
        if (!tractor) return tractor_id;
        return tractor.brand + " " + tractor.model;
    };

    getData = () => {
        let dates = {};
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];

            const pull = this.state.allObjects[obj.pull];
            if (!pull) continue;

            let date = new Date(pull.date).toJSON();

            if (this.state.season) {
                if (pull.season !== this.state.season) {
                    continue;
                }
            } else {
                date = new Date(pull.date.split("/")[2]).toJSON();
            }

            const hookCount = obj.hooks.length;
            if (hookCount <= 1) continue;
            for (let h in obj.hooks) {
                const hook = this.state.allObjects[obj.hooks[h]];
                if (!hook) continue;
                if (!hook.puller) continue;
                if (hook.puller !== this.state.puller) continue;
                if (!hook.tractor) continue;

                const val = hook.puller + " " + hook.tractor;

                if (!dates[val]) {
                    dates[val] = {};
                }
                if (!dates[val][date]) {
                    dates[val][date] = { hooks: 0, position_sum: 0 };
                }
                dates[val][date].hooks++;
                dates[val][date].position_sum =
                    dates[val][date].position_sum +
                    (hookCount - hook.position) / hookCount;
            }
        }

        let data = [];
        let dateSet = new Set();
        for (let p in dates) {
            for (let d in dates[p]) {
                dateSet.add(d);
                data.push({
                    group: this.getDisplay(p.split(" ")[1]),
                    value: parseInt(
                        (dates[p][d].position_sum / dates[p][d].hooks) * 100
                    ),
                    date: d
                });
            }
        }
        data.sort(this.dataSort);
        return data;
    };

    titleRender() {
        return "Puller Analysis";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), ["season", "puller"])}
                <div className="contentRow">
                    {this.getLineChart(this.getData())}
                </div>
            </div>
        );
    }
}

export default Pullers;
