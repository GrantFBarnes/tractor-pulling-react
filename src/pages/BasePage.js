import React, { Component } from "react";
import { Loading } from "carbon-components-react";

import "../styling/BasePage.css";

import EditModal from "../components/EditModal";
import BaseNav from "../components/BaseNav";

class BasePage extends Component {
    constructor() {
        super();
        this.state = { loading: true, canEdit: false, editModalOpen: false };
        this.server_host = window.location.origin;
        if (this.server_host.indexOf("localhost") >= 0) {
            this.server_host = "http://localhost:8080";
        }
    }

    toggleEditModal = () => {
        this.setState({ editModalOpen: !this.state.editModalOpen });
    };

    handleRequestEdit = secret => {
        const that = this;
        that.setState({ loading: true });
        fetch(this.server_host + "/api/token", {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ edit_secret: secret })
        })
            .then(response => {
                if (response.status === 200) {
                    that.setState({
                        loading: false,
                        canEdit: true,
                        editModalOpen: false
                    });
                } else {
                    that.setState({ loading: false, canEdit: false });
                    alert("Access Denied");
                }
            })
            .catch(err => {
                that.setState({ loading: false, canEdit: false });
                alert("Error, please try again");
            });
    };

    doneMounting() {}

    componentWillMount() {
        let server_host = window.location.origin;
        if (server_host.indexOf("localhost") >= 0) {
            server_host = "http://localhost:8080";
        }
        const that = this;
        fetch(this.server_host + "/api/authenticated", {
            credentials: "include"
        })
            .then(response => {
                if (response.status === 200) {
                    that.setState({ loading: false, canEdit: true });
                } else {
                    that.setState({ loading: false, canEdit: false });
                }
            })
            .catch(err => {
                that.setState({ loading: false, canEdit: false });
            });
        this.doneMounting();
    }

    render() {
        return (
            <div className="pageContainer">
                {this.state.loading ? <Loading withOverlay={true} /> : null}
                <BaseNav
                    canEdit={this.state.canEdit}
                    toggleEditModal={this.toggleEditModal}
                />
                <EditModal
                    open={this.state.editModalOpen}
                    closeModal={this.toggleEditModal}
                    handleRequestEdit={this.handleRequestEdit}
                />
                {this.contentRender()}
            </div>
        );
    }
}

export default BasePage;
