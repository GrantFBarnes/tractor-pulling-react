import React, { Component } from "react";
import { Modal, TextInput } from "carbon-components-react";

class EditModal extends Component {
    constructor() {
        super();
        this.state = { value: "" };
    }

    onSubmit = () => {
        this.props.handleRequestEdit(this.state.value);
        this.setState({ value: "" });
    };

    render() {
        return (
            <Modal
                open={this.props.open}
                shouldSubmitOnEnter={false}
                modalHeading="Request Access to Edit"
                primaryButtonText="Request"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onRequestClose={this.props.closeModal}
                onRequestSubmit={this.onSubmit}
                onSecondarySubmit={this.props.closeModal}
            >
                <TextInput
                    labelText="Edit Secret"
                    placeholder="Enter edit secret to get edit access"
                    value={this.state.value}
                    defaultValue={this.state.value}
                    light={false}
                    onChange={e => {
                        const target = e.target;
                        this.setState(prevState => ({ value: target.value }));
                    }}
                />
            </Modal>
        );
    }
}

export default EditModal;
