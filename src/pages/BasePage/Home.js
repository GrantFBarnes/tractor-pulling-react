import React from "react";
import BasePage from "../BasePage";

import { Button } from "carbon-components-react";

import ListNum32 from "@carbon/icons-react/lib/list--numbered/32";
import Video20 from "@carbon/icons-react/lib/video/20";

class Home extends BasePage {
    contentRender() {
        return (
            <div className="contentContainer">
                <h3 className="center">Community Antique Tractor Pulling</h3>
                <br />
                <br />
                <div className="contentRow center">
                    <Button kind="ghost" renderIcon={ListNum32} href="/results">
                        Results
                    </Button>
                </div>
                <div className="contentRow center">
                    <Button
                        kind="ghost"
                        renderIcon={Video20}
                        href={this.youtube_link}
                    >
                        YouTube
                    </Button>
                </div>
            </div>
        );
    }
}

export default Home;
