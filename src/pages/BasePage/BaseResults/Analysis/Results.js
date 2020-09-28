import React from "react";
import Analysis from "../Analysis";

import { SimpleBarChart, PieChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

import "../../../../styling/Charts.scss";

class Results extends Analysis {
    constructor() {
        super();
        this.page = "Results";
    }

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

    titleRender() {
        return "Result Analysis";
    }

    contentRender() {
        const data = this.getData();
        const height =
            Math.max(
                window.innerHeight * 0.7,
                JSON.stringify(data).length * 0.9
            ) + "px";
        const x = this.getXName();
        const y = this.getYName();
        return (
            <div className="contentContainer">
                {this.genFilters(this.getFiltered(), [
                    "season",
                    "pull",
                    "subject",
                    "metric",
                    "youtube"
                ])}
                <div className="contentRow">
                    {this.getBarChart(data, height, x, y)}
                </div>
                {this.state.metric !== "percentile" ? (
                    <>
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className="contentRow">
                            {this.getPieChart(data, height, x, y)}
                        </div>
                    </>
                ) : null}
            </div>
        );
    }
}

export default Results;
