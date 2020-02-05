import React, { Component } from "react";
import {
    Header,
    HeaderName
} from "carbon-components-react/lib/components/UIShell";

class HomeNav extends Component {
    render() {
        return (
            <Header>
                <HeaderName prefix="CATP">Tractor Pulling</HeaderName>
            </Header>
        );
    }
}

export default HomeNav;
