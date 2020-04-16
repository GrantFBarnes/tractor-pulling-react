import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import Distances from "./pages/BasePage/BaseResults/Distances";
import Percentiles from "./pages/BasePage/BaseResults/Percentiles";
import Results from "./pages/BasePage/BaseResults/Results";
import Rivals from "./pages/BasePage/BaseResults/Rivals";
import Edit from "./pages/BasePage/BaseResults/Edit";

import Home from "./pages/BasePage/Home";

import Reroute from "./pages/Reroute";

import * as serviceWorker from "./serviceWorker";

import { Switch, Route, BrowserRouter } from "react-router-dom";

const routing = (
    <BrowserRouter>
        <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/results" component={Results} />
            <Route exact path="/distances" component={Distances} />
            <Route exact path="/percentiles" component={Percentiles} />
            <Route exact path="/rivals" component={Rivals} />
            <Route exact path="/edit" component={Edit} />
            <Route exact path="*" component={Reroute} />
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
