import React, { Component } from "react";
import { Modal, TextInput, Dropdown } from "carbon-components-react";

class HookModal extends Component {
    constructor() {
        super();
        this.state = { driver: "", tractor: "", distance: "" };
    }

    onSubmit = () => {
        console.log("save");
    };

    render() {
        return (
            <Modal
                open={this.props.open}
                shouldSubmitOnEnter={false}
                modalHeading="Hook"
                primaryButtonText="Save"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onRequestClose={this.props.closeModal}
                onRequestSubmit={this.onSubmit}
                onSecondarySubmit={this.props.closeModal}
            >
                <TextInput
                    id="driver"
                    labelText="Driver"
                    placeholder="Enter driver name"
                    value={this.state.driver}
                    light={false}
                    onChange={e => {
                        const target = e.target;
                        this.setState(prevState => ({ driver: target.value }));
                    }}
                />
                <TextInput
                    id="tractor"
                    labelText="Tractor"
                    placeholder="Enter tractor"
                    value={this.state.tractor}
                    light={false}
                    onChange={e => {
                        const target = e.target;
                        this.setState(prevState => ({ tractor: target.value }));
                    }}
                />
                <TextInput
                    id="distance"
                    labelText="Distance"
                    placeholder="Enter distance"
                    value={this.state.distance}
                    light={false}
                    onChange={e => {
                        const target = e.target;
                        this.setState(prevState => ({
                            distance: target.value
                        }));
                    }}
                />
            </Modal>
        );
    }
}

export default HookModal;
