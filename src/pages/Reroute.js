import React, { Component } from "react";

class Reroute extends Component {
    renderRedirect() {
        window.location.href = "/home";
    }

    render() {
        return <div>{this.renderRedirect()}</div>;
    }
}

export default Reroute;
