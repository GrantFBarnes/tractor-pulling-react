import React, { Component } from "react";
import openSocket from "socket.io-client";

class BasePage extends Component {
    constructor() {
        super();
        this.state = { loading: true };
        this.server_host = window.location.origin;
        if (this.server_host.indexOf("localhost") >= 0) {
            this.server_host = "https://localhost:8080";
        }
        this.socket = null;
    }

    doneMounting() {}

    componentWillMount() {
        let server_host = window.location.origin;
        if (server_host.indexOf("localhost") >= 0) {
            server_host = "https://localhost:8080";
        }
        const socket = openSocket(server_host);
        this.socket = socket;
        const that = this;
        socket.on("connect", function() {
            that.setState({ loading: false });
            that.doneMounting();
        });

        socket.on("disconnect", function() {
            that.setState({ loading: true });
        });
    }
}

export default BasePage;
