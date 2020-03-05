import React from "react";
import { Toggle } from "carbon-components-react";
import TypicalField from "../TypicalField";

class TypicalToggle extends TypicalField {
    getContent() {
        const id = this.props.obj.id + "*" + this.props.field;
        return (
            <Toggle
                labelText={this.props.title ? this.props.title : ""}
                toggled={this.state.value ? true : false}
                id={id}
                labelA={this.props.labelA ? this.props.labelA : "Off"}
                labelB={this.props.labelB ? this.props.labelB : "On"}
                onToggle={e => {
                    this.props.handleUpdate({ target: { id: id, value: e } });
                }}
            />
        );
    }
}

export default TypicalToggle;
