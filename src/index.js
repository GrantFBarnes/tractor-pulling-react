import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import Edit from "./pages/BasePage/Edit";
import Home from "./pages/BasePage/Home";
import Percentile from "./pages/BasePage/Percentile";
import Results from "./pages/BasePage/Results";
import Reroute from "./pages/BasePage/Reroute";
import Rivals from "./pages/BasePage/Rivals";

import * as serviceWorker from "./serviceWorker";

import { Switch, Route, BrowserRouter } from "react-router-dom";

const routing = (
    <BrowserRouter>
        <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/results" component={Results} />
            <Route exact path="/percentile" component={Percentile} />
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
