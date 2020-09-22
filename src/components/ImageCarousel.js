import React, { Component } from "react";

class ImageCarousel extends Component {
    constructor() {
        super();
        this.state = { image: 0 };
        setInterval(this.switchImage, 4000);
    }

    switchImage = () => {
        let nextImage = this.state.image + 1;
        if (this.props.images.length === nextImage) nextImage = 0;
        this.setState({ image: nextImage });
    };

    render() {
        if (!this.props.images[this.state.image]) return null;
        return (
            <div
                style={{ textAlign: "center" }}
                onClick={() => {
                    this.switchImage();
                }}
            >
                <img src={this.props.images[this.state.image]} alt="" />
            </div>
        );
    }
}

export default ImageCarousel;
