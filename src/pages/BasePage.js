import React, { Component } from "react";

import "../styling/BasePage.css";

class BasePage extends Component {
    constructor() {
        super();
        this.state = { loading: true };
        this.server_host = window.location.origin;
        if (this.server_host.indexOf("localhost") >= 0) {
            this.server_host = "https://localhost:8080";
        }
    }

    doneMounting() {}

    componentWillMount() {
        let server_host = window.location.origin;
        if (server_host.indexOf("localhost") >= 0) {
            server_host = "https://localhost:8080";
        }
        this.setState({ loading: false });
        this.doneMounting();
    }
}

export default BasePage;
