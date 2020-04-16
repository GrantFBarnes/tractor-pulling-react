import React from "react";
import BasePage from "../BasePage";

import { Button } from "carbon-components-react";

import ListNum32 from "@carbon/icons-react/lib/list--numbered/32";
import Percent32 from "@carbon/icons-react/lib/percentage/32";
import Rivals32 from "@carbon/icons-react/lib/partnership/32";
import Ruler32 from "@carbon/icons-react/lib/ruler/32";
import Video20 from "@carbon/icons-react/lib/video/20";
import Trophy32 from "@carbon/icons-react/lib/trophy/32";

class Home extends BasePage {
    titleRender() {
        return "Community Antique Tractor Pulling";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                <div className="contentRow center">
                    <Button kind="ghost" renderIcon={ListNum32} href="/results">
                        Results
                    </Button>
                </div>
                <div className="contentRow center">
                    <Button kind="ghost" renderIcon={Trophy32} href="/wins">
                        Wins
                    </Button>
                </div>
                <div className="contentRow center">
                    <Button kind="ghost" renderIcon={Ruler32} href="/distances">
                        Distances
                    </Button>
                </div>
                <div className="contentRow center">
                    <Button
                        kind="ghost"
                        renderIcon={Percent32}
                        href="/percentiles"
                    >
                        Percentiles
                    </Button>
                </div>
                <div className="contentRow center">
                    <Button kind="ghost" renderIcon={Rivals32} href="/rivals">
                        Rivals
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
