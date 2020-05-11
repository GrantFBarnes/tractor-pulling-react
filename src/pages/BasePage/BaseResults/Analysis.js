import React from "react";
import BaseResults from "../BaseResults";

class Analysis extends BaseResults {
    dataSort = (a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;

        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;

        if (a.group < b.group) return -1;
        if (a.group > b.group) return 1;

        return 0;
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

    getYName = () => {
        for (let i in this.metricOptions) {
            if (this.metricOptions[i].id !== this.state.metric) continue;
            return this.metricOptions[i].display;
        }
        return "";
    };
}

export default Analysis;
