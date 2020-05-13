import React from "react";
import Analysis from "../Analysis";

import { LineChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

import "../../../../styling/Charts.scss";

class Pullers extends Analysis {
    constructor() {
        super();
        this.page = "Pullers";
        this.state.subject = "combo";
    }

    getLineChart = data => {
        if (!data.length) return "No data, choose a different Season or Puller";
        return (
            <LineChart
                data={data}
                options={{
                    title: this.getYName() + " Over Time By Tractor",
                    axes: {
                        bottom: { mapsTo: "date", scaleType: "time" },
                        left: { mapsTo: "value", scaleType: "linear" }
                    },
                    curve: "curveMonotoneX", // most to least curvy curveBasis, curveNatural, curveMonotoneX, empty
                    height: window.innerHeight * 0.7 + "px"
                }}
            />
        );
    };

    titleRender() {
        return "Puller Analysis";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), [
                    "season",
                    "puller",
                    "metric"
                ])}
                <div className="contentRow">
                    {this.getLineChart(this.getData())}
                </div>
            </div>
        );
    }
}

export default Pullers;
