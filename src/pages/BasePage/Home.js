import React from "react";
import BasePage from "../BasePage";
import { Loading } from "carbon-components-react";

import "../../styling/BasePage.css";

class Home extends BasePage {
    constructor() {
        super();
        this.state.temp = "";
    }

    doneMounting() {}

    render() {
        return (
            <div>
                {this.state.loading ? <Loading withOverlay={true} /> : null}
                Website is under development...
            </div>
        );
    }
}

export default Home;
