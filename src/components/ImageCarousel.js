import React, { Component } from "react";

class ImageCarousel extends Component {
    constructor() {
        super();
        this.state = { image: 0, cron: true };
        setInterval(this.autoSwitch, 4000);
    }

    getNextImage = () => {
        if (this.props.images.length === this.state.image + 1) return 0;
        return this.state.image + 1;
    };

    clickSwitch = () => {
        this.setState({ image: this.getNextImage(), cron: false });
    };

    autoSwitch = () => {
        if (!this.state.cron) return;
        this.setState({ image: this.getNextImage() });
    };

    render() {
        if (!this.props.images[this.state.image]) return null;
        return (
            <div
                style={{ textAlign: "center" }}
                onClick={() => {
                    this.clickSwitch();
                }}
            >
                <img src={this.props.images[this.state.image]} alt="" />
            </div>
        );
    }
}

export default ImageCarousel;
