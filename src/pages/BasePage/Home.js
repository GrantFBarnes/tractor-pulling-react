import React from "react";
import BasePage from "../BasePage";
import { Loading } from "carbon-components-react";

import HomeNav from "../../components/Home/HomeNav";

import "../../styling/BasePage.css";

class Home extends BasePage {
    doneMounting() {}

    render() {
        return (
            <div className="pageContainer">
                {this.state.loading ? <Loading withOverlay={true} /> : null}
                <HomeNav />
                <h3> Website is under development...</h3>
            </div>
        );
    }
}

export default Home;
