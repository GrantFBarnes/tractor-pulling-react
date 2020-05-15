import React, { Component } from "react";
import { Modal, TextInput, TextArea } from "carbon-components-react";

class ContactModal extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            subject: "",
            message: "",
            errors: { subject: "Required", message: "Required" }
        };
    }

    validate = () => {
        let newState = { errors: {} };

        if (!this.state.subject) {
            newState.errors.subject = "Required";
        } else if (this.state.subject.length > 280) {
            newState.errors.subject = "Too Many Characters";
        }

        if (!this.state.message) {
            newState.errors.message = "Required";
        } else if (this.state.message.length > 10000) {
            newState.errors.message = "Too Many Characters";
        }

        if (this.state.email.length > 100) {
            newState.errors.email = "Too Many Characters";
        }

        this.setState(prevState => newState);
    };

    onChange = (e, field) => {
        const target = e.target;
        this.setState(prevState => ({ [field]: target.value }), this.validate);
    };

    onBlur = field => {
        this.setState(
            prevState => ({ [field]: this.state[field].trim() }),
            this.validate
        );
    };

    onSubmit = () => {
        if (Object.keys(this.state.errors).length) return;

        this.props.closeModal();
        this.props
            .sendEmail({
                email: this.state.email,
                subject: this.state.subject,
                message: this.state.message
            })
            .then(() => {
                this.setState({
                    email: "",
                    subject: "",
                    message: "",
                    errors: { subject: "Required", message: "Required" }
                });
                alert("Email was sent successfully!");
            })
            .catch(err => {
                alert(
                    "Email failed to send, please send direct email outside of this webiste."
                );
            });
    };

    render() {
        return (
            <Modal
                open={this.props.open}
                modalHeading="Contact"
                modalAriaLabel="ContactModal"
                primaryButtonText="Send Email"
                secondaryButtonText="Cancel"
                iconDescription="Close"
                onRequestClose={this.props.closeModal}
                onRequestSubmit={this.onSubmit}
                onSecondarySubmit={this.props.closeModal}
            >
                <div className="contentRow">
                    <p>
                        Filling out this form will send an email to
                        <a> tractorpulling.club@gmail.com</a> to get in contact
                        with the makers of this site. You can provide your email
                        at the bottom if you are looking for a response.
                    </p>
                </div>
                <div className="contentRow">
                    <TextInput
                        labelText="Subject"
                        placeholder="Please Provide a Subject"
                        value={this.state.subject}
                        id="ContactModal_subject"
                        light={false}
                        invalid={this.state.errors.subject ? true : false}
                        invalidText={this.state.errors.subject}
                        onChange={e => {
                            this.onChange(e, "subject");
                        }}
                        onBlur={() => {
                            this.onBlur("subject");
                        }}
                    />
                </div>
                <div className="contentRow">
                    <TextArea
                        labelText="Message"
                        placeholder="Please Provide Message"
                        value={this.state.message}
                        id="ContactModal_message"
                        light={false}
                        invalid={this.state.errors.message ? true : false}
                        invalidText={this.state.errors.message}
                        onChange={e => {
                            this.onChange(e, "message");
                        }}
                        onBlur={() => {
                            this.onBlur("message");
                        }}
                    />
                </div>
                <div className="contentRow">
                    <TextInput
                        labelText="Email (Optional)"
                        placeholder="Provid an email if you'd like a response"
                        value={this.state.email}
                        id="ContactModal_email"
                        light={false}
                        invalid={this.state.errors.email ? true : false}
                        invalidText={this.state.errors.email}
                        onChange={e => {
                            this.onChange(e, "email");
                        }}
                        onBlur={() => {
                            this.onBlur("email");
                        }}
                    />
                </div>
            </Modal>
        );
    }
}

export default ContactModal;
