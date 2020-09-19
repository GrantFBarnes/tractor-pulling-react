import React from "react";
import { TextInput } from "carbon-components-react";
import TypicalField from "../TypicalField";

class TypicalTextInput extends TypicalField {
    getContent() {
        return (
            <TextInput
                labelText={this.props.title ? this.props.title : ""}
                placeholder="(No Value Specified)"
                value={this.state.value}
                id={this.props.obj.id + "*" + this.props.field}
                light={false}
                className="typical_input"
                onChange={e => {
                    const target = e.target;
                    this.setState({ value: target.value });
                }}
                onBlur={e => {
                    this.props.handleUpdate(e);
                }}
            />
        );
    }
}

export default TypicalTextInput;
