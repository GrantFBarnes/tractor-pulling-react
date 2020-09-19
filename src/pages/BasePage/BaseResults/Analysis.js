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

    getSubject = hook => {
        const puller = this.state.allObjects[hook.puller];
        const tractor = this.state.allObjects[hook.tractor];
        switch (this.state.subject) {
            case "puller":
                if (puller) return puller.first_name + " " + puller.last_name;
                break;

            case "combo":
                if (puller && tractor) {
                    if (this.page === "Pullers") {
                        return tractor.brand + " " + tractor.model;
                    }
                    return (
                        puller.first_name[0] +
                        ". " +
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

    getData = () => {
        let subjects = {};
        for (let id in this.state.allTypes.Class) {
            const obj = this.state.allTypes.Class[id];

            const pull = this.state.allObjects[obj.pull];
            if (!pull) continue;

            if (this.page === "Results") {
                if (this.state.pull) {
                    if (obj.pull !== this.state.pull) {
                        continue;
                    }
                }
            }

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
                if (!hook.tractor) continue;

                const subject = this.getSubject(hook);
                if (!subject) continue;

                if (this.page === "Pullers") {
                    if (hook.puller !== this.state.puller) continue;

                    if (!subjects[subject]) subjects[subject] = {};
                    if (this.state.metric === "percentile") {
                        if (!subjects[subject][date]) {
                            subjects[subject][date] = { total: 0, sum: 0 };
                        }
                        subjects[subject][date].total++;
                        subjects[subject][date].sum =
                            subjects[subject][date].sum +
                            (hookCount - hook.position) / hookCount;
                    } else {
                        if (!subjects[subject][date]) {
                            subjects[subject][date] = 0;
                        }
                        subjects[subject][date] =
                            subjects[subject][date] + this.getMeticVal(hook);
                    }
                } else if (this.page === "Results") {
                    if (this.state.metric === "percentile") {
                        if (!subjects[subject]) {
                            subjects[subject] = { total: 0, sum: 0 };
                        }
                        subjects[subject].total++;
                        subjects[subject].sum =
                            subjects[subject].sum +
                            (hookCount - hook.position) / hookCount;
                    } else {
                        if (!subjects[subject]) subjects[subject] = 0;
                        subjects[subject] =
                            subjects[subject] + this.getMeticVal(hook);
                    }
                }
            }
        }

        let data = [];
        for (let x in subjects) {
            if (!subjects[x]) continue;
            if (this.page === "Pullers") {
                if (this.state.metric === "percentile") {
                    for (let d in subjects[x]) {
                        data.push({
                            group: x,
                            value: parseInt(
                                (subjects[x][d].sum / subjects[x][d].total) *
                                    100
                            ),
                            date: d
                        });
                    }
                } else {
                    for (let d in subjects[x]) {
                        data.push({ group: x, value: subjects[x][d], date: d });
                    }
                }
            } else if (this.page === "Results") {
                if (this.state.metric === "percentile") {
                    data.push({
                        group: x,
                        value: parseInt(
                            (subjects[x].sum / subjects[x].total) * 100
                        )
                    });
                } else {
                    data.push({ group: x, value: subjects[x] });
                }
            }
        }
        data.sort(this.dataSort);

        if (this.page === "Results") {
            while (data.length > 11) {
                data[data.length - 2].group = "Other";
                data[data.length - 2].value =
                    data[data.length - 2].value + data[data.length - 1].value;
                data.pop();
            }
        }
        return data;
    };
}

export default Analysis;
