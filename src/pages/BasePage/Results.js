import React from "react";
import BasePage from "../BasePage";
import { Loading } from "carbon-components-react";

import ResultsNav from "../../components/Results/ResultsNav";

class Home extends BasePage {
    doneMounting() {}

    render() {
        return (
            <div className="pageContainer">
                {this.state.loading ? <Loading withOverlay={true} /> : null}
                <ResultsNav />
                <h3>Results are not added yet...</h3>
            </div>
        );
    }
}

export default Home;
