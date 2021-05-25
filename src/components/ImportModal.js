import React, { Component } from "react";
import { Modal, FileUploader } from "carbon-components-react";

class ImportModal extends Component {
    constructor() {
        super();
        this.state = { file: null, file_error: true };
    }

    validate = () => {
        this.setState({ file_error: !this.state.file });
    };

    onChange = field => e => {
        const value = e.target.files ? e.target.files[0] : null;
        this.setState({ [field]: value }, this.validate);
    };

    onSubmit = () => {
        if (this.state.file_error) {
            alert("Must provide a file");
            return;
        }
        const reader = new FileReader();
        reader.onload = event => {
            this.props.importFile({ file_binary: event.target.result });
        };
        reader.readAsBinaryString(this.state.file);
    };

    render() {
        return (
            <Modal
                open={this.props.open}
                shouldSubmitOnEnter={false}
                modalHeading="Import an Excel File"
                modalAriaLabel="import"
                primaryButtonText="Import"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onRequestClose={this.props.closeModal}
                onRequestSubmit={this.onSubmit}
                onSecondarySubmit={this.props.closeModal}
            >
                <div className="bx--file__container">
                    <FileUploader
                        labelDescription="Excel File"
                        buttonLabel="Choose file"
                        filenameStatus="edit"
                        accept={[".xlsx"]}
                        name=""
                        multiple={false}
                        iconDescription="Remove File"
                        onChange={e => {
                            this.onChange("file")(e);
                        }}
                    />
                </div>
            </Modal>
        );
    }
}

export default ImportModal;
