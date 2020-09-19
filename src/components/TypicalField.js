import { Component } from "react";

class TypicalField extends Component {
    constructor() {
        super();
        this.state = { value: "" };
    }

    static getDerivedStateFromProps(props, state) {
        return { value: state.value || props.obj[props.field] };
    }

    render() {
        if (!this.props.obj) return null;
        return this.getContent();
    }
}

export default TypicalField;
