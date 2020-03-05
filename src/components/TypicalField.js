import React, { Component } from "react";

class TypicalField extends Component {
    constructor() {
        super();
        this.state = { value: "" };
    }

    updateComponent() {
        if (!this.props.obj) return;
        this.setState({ value: this.props.obj[this.props.field] });
    }

    componentWillMount() {
        this.updateComponent();
    }

    componentDidUpdate(oldProps) {
        if (oldProps !== this.props) {
            this.updateComponent();
        }
    }

    render() {
        if (!this.props.obj) return null;
        return this.getContent();
    }
}

export default TypicalField;
