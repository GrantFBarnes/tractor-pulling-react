import React, { Component } from "react";
import { Loading } from "carbon-components-react";
import {
    Header,
    HeaderName,
    HeaderMenuButton,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SideNav,
    SideNavItems,
    SideNavLink
} from "carbon-components-react/lib/components/UIShell";

import Edit20 from "@carbon/icons-react/lib/edit/20";
import Home20 from "@carbon/icons-react/lib/home/20";
import ListNum32 from "@carbon/icons-react/lib/list--numbered/32";
import Video20 from "@carbon/icons-react/lib/video/20";

import "../styling/BasePage.css";

import TokenModal from "../components/TokenModal";

class BasePage extends Component {
    constructor() {
        super();
        this.youtube_link =
            "https://www.youtube.com/channel/UCIJUfssINon5pT4x9R25Iyg";
        this.state = {
            loading: true,
            canEdit: false,
            sideExpanded: false,
            tokenModalOpen: false
        };
        this.server_host = window.location.origin;
        if (this.server_host.indexOf("localhost") >= 0) {
            this.server_host = "http://localhost:8080";
        }
    }

    toggleTokenModal = () => {
        this.setState({ tokenModalOpen: !this.state.tokenModalOpen });
    };

    handleRequestToken = secret => {
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
                        tokenModalOpen: false
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
            <div className="container">
                {this.state.loading ? <Loading withOverlay={true} /> : null}
                <Header aria-label="header">
                    <HeaderMenuButton
                        aria-label="header menu button"
                        onClick={() => {
                            this.setState({
                                sideExpanded: !this.state.sideExpanded
                            });
                        }}
                        isActive={this.state.sideExpanded}
                    />
                    <HeaderName prefix="CATP" href="/home">Tractor Pulling</HeaderName>
                    <SideNav
                        aria-label="side nav"
                        expanded={this.state.sideExpanded}
                    >
                        <SideNavItems>
                            <SideNavLink renderIcon={Home20} href="/home">
                                Home
                            </SideNavLink>
                            <SideNavLink renderIcon={ListNum32} href="/results">
                                Results
                            </SideNavLink>
                            <SideNavLink
                                renderIcon={Video20}
                                href={this.youtube_link}
                            >
                                Youtube
                            </SideNavLink>
                        </SideNavItems>
                    </SideNav>
                    <HeaderGlobalBar aria-label="header global bar">
                        {this.state.canEdit ? null : (
                            <HeaderGlobalAction
                                aria-label="header global action"
                                title="Enter Edit Mode"
                                onClick={e => {
                                    this.toggleTokenModal();
                                }}
                            >
                                <Edit20 />
                            </HeaderGlobalAction>
                        )}
                    </HeaderGlobalBar>
                </Header>
                <TokenModal
                    open={this.state.tokenModalOpen}
                    closeModal={this.toggleTokenModal}
                    handleRequestToken={this.handleRequestToken}
                />
                <div className="pageContainer">{this.contentRender()}</div>
            </div>
        );
    }
}

export default BasePage;
