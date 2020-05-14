import React from "react";
import BasePage from "../BasePage";

import { Button } from "carbon-components-react";

class Home extends BasePage {
    genButton = button => {
        return (
            <Button
                kind="ghost"
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
                <div className="contentRow center">
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
            if (right) {
                buttons.push(
                    <div className="contentRow center">
                        <div className="halfColumn paddingRight">
                            {this.genButton(left)}
                        </div>
                        <div className="halfColumn paddingLeft">
                            {this.genButton(right)}
                        </div>
                    </div>
                );
            } else {
                buttons.push(
                    <div className="contentRow center">
                        {this.genButton(left)}
                    </div>
                );
            }
            i++;
        }
        return buttons;
    };

    titleRender() {
        return "Community Antique Tractor Pulling";
    }

    contentRender() {
        return (
            <div className="contentContainer">
                {this.state.smallWindow
                    ? this.genSmButtons()
                    : this.genLgButtons()}
            </div>
        );
    }
}

export default Home;
