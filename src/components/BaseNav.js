import React, { Component } from "react";
import {
    Header,
    HeaderName,
    HeaderMenuButton,
    SideNav,
    SideNavMenu,
    SideNavMenuItem,
    SideNavItems,
    SideNavLink
} from "carbon-components-react/lib/components/UIShell";

import CollapseCategories32 from "@carbon/icons-react/lib/collapse-categories/32";
import Home20 from "@carbon/icons-react/lib/home/20";
import Video20 from "@carbon/icons-react/lib/video/20";

class BaseNav extends Component {
    constructor() {
        super();
        this.state = { sideExpanded: false };
    }

    render() {
        return (
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
                <HeaderName prefix="CATP">Tractor Pulling</HeaderName>
                <SideNav
                    aria-label="side nav"
                    expanded={this.state.sideExpanded}
                >
                    <SideNavItems>
                        <SideNavLink renderIcon={Home20} href="/home">
                            Home
                        </SideNavLink>
                        <SideNavMenu
                            renderIcon={CollapseCategories32}
                            title="Results"
                        >
                            <SideNavMenuItem href="/results?season=2020">
                                2020 Season
                            </SideNavMenuItem>
                            <SideNavMenuItem href="/results?season=2019">
                                2019 Season
                            </SideNavMenuItem>
                            <SideNavMenuItem href="/results?season=2018">
                                2018 Season
                            </SideNavMenuItem>
                        </SideNavMenu>
                        <SideNavLink
                            renderIcon={Video20}
                            href="https://www.youtube.com/channel/UCIJUfssINon5pT4x9R25Iyg"
                        >
                            Youtube
                        </SideNavLink>
                    </SideNavItems>
                </SideNav>
            </Header>
        );
    }
}

export default BaseNav;
