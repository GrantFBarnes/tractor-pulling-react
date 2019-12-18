import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Home from "./pages/BasePage/Home";
import Reroute from "./pages/BasePage/Reroute";

import * as serviceWorker from "./serviceWorker";

import { Switch, Route, BrowserRouter } from "react-router-dom";

const routing = (
    <BrowserRouter>
        <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="*" component={Reroute} />
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
