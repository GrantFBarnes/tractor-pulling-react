import React from "react";
import BaseResults from "../BaseResults";

import { SimpleBarChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

import "../../../styling/Charts.scss";

class Charts extends BaseResults {
    getBarChart = (data, title) => {
        return (
            <SimpleBarChart
                data={data}
                options={{
                    title: title,
                    axes: {
                        left: { mapsTo: "value" },
                        bottom: { mapsTo: "group", scaleType: "labels" }
                    },
                    height: "450px"
                }}
            />
        );
    };

    getData = () => {
        let brands = {};
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
                const tractor = this.state.allObjects[hook.tractor];
                if (!tractor) continue;
                if (!brands[tractor.brand]) {
                    brands[tractor.brand] = 0;
                }
                brands[tractor.brand]++;
            }
        }

        let data = [];
        for (let b in brands) {
            data.push({ group: b, value: brands[b] });
        }
        return data;
    };

    titleRender() {
        return "Charts";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), ["season", "pull"])}
                <div className="contentRow">
                    {this.getBarChart(this.getData(), "Hooks By Tractor Brand")}
                </div>
            </div>
        );
    }
}

export default Charts;
