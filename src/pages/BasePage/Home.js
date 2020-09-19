import React from "react";
import BasePage from "../BasePage";

import { Button } from "carbon-components-react";

import logo from "../../images/logo.png";
import tractor1 from "../../images/tractor1.png";
import tractor2 from "../../images/tractor2.png";
import tractor3 from "../../images/tractor3.png";
import tractor4 from "../../images/tractor4.png";
import tractor5 from "../../images/tractor5.png";
import tractor6 from "../../images/tractor6.png";

import ImageCarousel from "../../components/ImageCarousel";

class Home extends BasePage {
    genButton = button => {
        return (
            <Button
                kind={button.full ? "primary" : "ghost"}
                size="field"
                className="homeButton"
                renderIcon={button.icon}
                href={button.href}
                target={button.target}
            >
                {button.text}
            </Button>
        );
    };

    genSmButtons = () => {
        let buttons = [];
        for (let text in this.buttons) {
            buttons.push(
                <div key={text + "Button"} className="contentRow center">
                    {this.genButton(this.buttons[text])}
                </div>
            );
        }
        return buttons;
    };

    genLgButtons = () => {
        let buttons = [];
        let keys = Object.keys(this.buttons);
        for (let i = 0; i < keys.length; i++) {
            const left = this.buttons[keys[i]];
            const right = this.buttons[keys[i + 1]];
            if (left.full || !right) {
                buttons.push(
                    <div key={i} className="contentRow center">
                        {this.genButton(left)}
                    </div>
                );
            } else {
                buttons.push(
                    <div key={i} className="contentRow center">
                        <div className="halfColumn paddingRight">
                            {this.genButton(left)}
                        </div>
                        <div className="halfColumn paddingLeft">
                            {this.genButton(right)}
                        </div>
                    </div>
                );
                i++;
            }
        }
        return buttons;
    };

    titleRender() {
        return <img src={logo} alt="Community Antique Tractor Pullers" />;
    }

    contentRender() {
        return (
            <div className="contentContainer">
                <ImageCarousel
                    images={[
                        tractor1,
                        tractor2,
                        tractor3,
                        tractor4,
                        tractor5,
                        tractor6
                    ]}
                ></ImageCarousel>
                <br />
                <br />
                {this.state.smallWindow
                    ? this.genSmButtons()
                    : this.genLgButtons()}
            </div>
        );
    }
}

export default Home;
