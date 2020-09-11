import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import Home from "./pages/BasePage/Home";
import Edit from "./pages/BasePage/BaseResults/Edit";

import Distances from "./pages/BasePage/BaseResults/Distances";
import Percentiles from "./pages/BasePage/BaseResults/Percentiles";
import Results from "./pages/BasePage/BaseResults/Results";
import Rivals from "./pages/BasePage/BaseResults/Rivals";
import Wins from "./pages/BasePage/BaseResults/Wins";

import AnalysisResults from "./pages/BasePage/BaseResults/Analysis/Results";
import AnalysisPullers from "./pages/BasePage/BaseResults/Analysis/Pullers";

import Reroute from "./pages/Reroute";

import { Switch, Route, BrowserRouter } from "react-router-dom";

const routing = (
    <BrowserRouter>
        <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/edit" component={Edit} />

            <Route exact path="/distances" component={Distances} />
            <Route exact path="/percentiles" component={Percentiles} />
            <Route exact path="/results" component={Results} />
            <Route exact path="/rivals" component={Rivals} />
            <Route exact path="/wins" component={Wins} />

            <Route exact path="/analysis/results" component={AnalysisResults} />
            <Route exact path="/analysis/pullers" component={AnalysisPullers} />

            <Route exact path="*" component={Reroute} />
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById("root"));
