import React from "react";
import BasePage from "../BasePage";

class Reroute extends BasePage {
    renderRedirect = () => {
        window.location.href = "/home";
    };

    render() {
        return <div>{this.renderRedirect()}</div>;
    }
}

export default Reroute;
