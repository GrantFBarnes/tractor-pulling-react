import React, { Component } from "react";
import { Loading } from "carbon-components-react";
import {
    Header,
    HeaderName,
    HeaderMenuButton,
    SideNav,
    SideNavItems,
    SideNavLink
} from "carbon-components-react/lib/components/UIShell";

import ChartBar20 from "@carbon/icons-react/lib/chart--bar/20";
import ChartLine20 from "@carbon/icons-react/lib/chart--line/20";
import Edit20 from "@carbon/icons-react/lib/edit/20";
import Home20 from "@carbon/icons-react/lib/home/20";
import ListNum32 from "@carbon/icons-react/lib/list--numbered/32";
import Percent32 from "@carbon/icons-react/lib/percentage/32";
import Rival32 from "@carbon/icons-react/lib/partnership/32";
import Ruler32 from "@carbon/icons-react/lib/ruler/32";
import Video20 from "@carbon/icons-react/lib/video/20";
import Trophy32 from "@carbon/icons-react/lib/trophy/32";

import "../styling/BasePage.css";

class BasePage extends Component {
    constructor() {
        super();
        this.state = { loading: true, smallWindow: false, sideExpanded: false };
        this.server_host = window.location.origin;
        if (this.server_host.indexOf("localhost") >= 0) {
            this.server_host = "http://localhost:8080";
        }
        this.youtube_link =
            "https://www.youtube.com/channel/UCIJUfssINon5pT4x9R25Iyg";
    }

    setUp() {
        this.setState({ loading: false });
    }

    updatePageWidth() {
        this.setState({
            sideExpanded: window.innerWidth > 1056,
            smallWindow: window.innerWidth < 600
        });
    }

    componentWillMount() {
        this.setUp();
        this.updatePageWidth();
        window.addEventListener("resize", this.updatePageWidth.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updatePageWidth.bind(this));
    }

    getContainerClass() {
        if (this.state.sideExpanded) {
            return "container containerSideExpanded";
        }
        return "container containerSideCollapsed";
    }

    titleRender() {
        return "";
    }

    contentRender() {
        return null;
    }

    render() {
        return (
            <div className={this.getContainerClass()}>
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
                    <HeaderName prefix="CATP" href="/home">
                        Tractor Pulling
                    </HeaderName>
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
                            <SideNavLink renderIcon={Trophy32} href="/wins">
                                Wins
                            </SideNavLink>
                            <SideNavLink renderIcon={Ruler32} href="/distances">
                                Distances
                            </SideNavLink>
                            <SideNavLink
                                renderIcon={Percent32}
                                href="/percentiles"
                            >
                                Percentile
                            </SideNavLink>
                            <SideNavLink renderIcon={Rival32} href="/rivals">
                                Rivals
                            </SideNavLink>
                            <SideNavLink renderIcon={ChartBar20} href="/charts">
                                Charts
                            </SideNavLink>
                            <SideNavLink renderIcon={ChartLine20} href="/time">
                                Time Analysis
                            </SideNavLink>
                            <SideNavLink
                                renderIcon={Video20}
                                href={this.youtube_link}
                            >
                                Youtube
                            </SideNavLink>
                            <SideNavLink renderIcon={Edit20} href="/edit">
                                Edit
                            </SideNavLink>
                        </SideNavItems>
                    </SideNav>
                </Header>
                <div className="pageContainer">
                    <h3 className="titleHeader">{this.titleRender()}</h3>
                    {this.contentRender()}
                </div>
            </div>
        );
    }
}

export default BasePage;
