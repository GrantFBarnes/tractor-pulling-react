import React, { Component } from "react";
import { Loading, Dropdown } from "carbon-components-react";
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
            smallWindow: false,
            sideExpanded: false,
            tokenModalOpen: false,

            allObjects: {},
            season: "",
            pull: "",
            class: ""
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

    itemToString = item => {
        if (item) return item.display;
        return "";
    };

    getSelected = (field, options) => {
        for (let i in options) {
            if (options[i].id === this.state[field]) {
                return options[i];
            }
        }
        return { id: "", display: this.state[field] };
    };

    genSeasonDropdown = filtered => {
        return (
            <Dropdown
                id="seasons_dropdown"
                label="Season"
                titleText="Season"
                light={false}
                items={filtered.seasons}
                itemToString={this.itemToString}
                selectedItem={this.getSelected("season", filtered.seasons)}
                initialSelectedItem={this.getSelected(
                    "season",
                    filtered.seasons
                )}
                onChange={e => {
                    if (!e.selectedItem) {
                        e.selectedItem = { id: "" };
                    }
                    this.setState({ season: e.selectedItem.id });
                }}
            />
        );
    };

    genPullDropdown = filtered => {
        return (
            <Dropdown
                id="pull_dropdown"
                label="Pull"
                titleText="Pull"
                light={false}
                items={filtered.pulls}
                itemToString={this.itemToString}
                selectedItem={this.getSelected("pull", filtered.pulls)}
                initialSelectedItem={this.getSelected("pull", filtered.pulls)}
                onChange={e => {
                    if (!e.selectedItem) {
                        e.selectedItem = { id: "" };
                    }
                    this.setState({ pull: e.selectedItem.id });
                }}
            />
        );
    };

    genClassDropdown = filtered => {
        return (
            <Dropdown
                id="class_dropdown"
                label="Class"
                titleText="Class"
                light={false}
                items={filtered.classes}
                itemToString={this.itemToString}
                selectedItem={this.getSelected("class", filtered.classes)}
                initialSelectedItem={this.getSelected(
                    "class",
                    filtered.classes
                )}
                onChange={e => {
                    if (!e.selectedItem) {
                        e.selectedItem = { id: "" };
                    }
                    this.setState({ class: e.selectedItem.id });
                }}
            />
        );
    };

    getDisplay = (objs, type) => {
        switch (type) {
            case "seasons":
                for (let i in objs) {
                    const obj = objs[i];
                    objs[i] = { id: obj.id, display: obj.year };
                }
                break;

            case "pulls":
                for (let i in objs) {
                    const obj = objs[i];
                    const location = this.state.allObjects[obj.location]
                        ? this.state.allObjects[obj.location].town +
                          ", " +
                          this.state.allObjects[obj.location].state
                        : "(No Location)";
                    objs[i] = {
                        id: obj.id,
                        display: obj.date + " - " + location
                    };
                }
                break;

            case "classes":
                for (let i in objs) {
                    const obj = objs[i];
                    let display = obj.weight + " " + obj.category;
                    if (obj.speed > 4) display += " (" + obj.speed + ")";
                    objs[i] = { id: obj.id, display: display };
                }
                break;

            case "hooks":
                for (let i in objs) {
                    const obj = objs[i];
                    objs[i] = {
                        id: obj.id,
                        position: obj.position,
                        puller: this.state.allObjects[obj.puller]
                            ? this.state.allObjects[obj.puller].first_name +
                              " " +
                              this.state.allObjects[obj.puller].last_name
                            : "(No Puller)",
                        tractor: this.state.allObjects[obj.tractor]
                            ? this.state.allObjects[obj.tractor].brand +
                              " " +
                              this.state.allObjects[obj.tractor].model
                            : "(No Tractor)",
                        distance: obj.distance
                    };
                }
                break;

            default:
                break;
        }
        return objs;
    };

    getFiltered = () => {
        let filtered = {
            seasons: [],
            pulls: [],
            classes: [],
            hooks: []
        };
        for (let id in this.state.allObjects) {
            const obj = this.state.allObjects[id];
            switch (obj.type) {
                case "Season":
                    filtered.seasons.push(obj);
                    break;
                case "Pull":
                    if (obj.season === this.state.season) {
                        filtered.pulls.push(obj);
                    }
                    break;
                case "Class":
                    if (obj.pull === this.state.pull) {
                        filtered.classes.push(obj);
                    }
                    break;
                case "Hook":
                    if (obj.class === this.state.class) {
                        filtered.hooks.push(obj);
                    }
                    break;
                default:
                    break;
            }
        }

        filtered.seasons.sort(this.seasonSort);
        filtered.pulls.sort(this.pullSort);
        filtered.classes.sort(this.classSort);
        filtered.hooks.sort(this.hookSort);

        for (let i in filtered) {
            filtered[i] = this.getDisplay(filtered[i], i);
        }

        if (!filtered.seasons.length) filtered.pulls = [];
        if (!filtered.pulls.length) filtered.classes = [];
        if (!filtered.classes.length) filtered.hooks = [];

        filtered.seasons.push({ id: "", display: "(Blank)" });
        filtered.pulls.push({ id: "", display: "(Blank)" });
        filtered.classes.push({ id: "", display: "(Blank)" });

        return filtered;
    };

    setUp = allObjects => {
        let newState = { loading: false, allObjects: allObjects };
        if (this.props.location.search) {
            const params = this.props.location.search.split("&");
            for (let i in params) {
                params[i] = params[i].replace("?", "");
                let split = params[i].split("=");
                if (split[0] === "season") {
                    newState.season = split[1];
                } else if (split[0] === "pull") {
                    newState.pull = split[1];
                } else if (split[0] === "class") {
                    newState.class = split[1];
                }
            }
        } else {
            let latestSeason = {};
            for (let id in allObjects) {
                const obj = allObjects[id];
                if (obj.type !== "Season") continue;
                if (!latestSeason.year || obj.year > latestSeason.year) {
                    latestSeason = obj;
                }
            }
            newState.season = latestSeason.id;

            let latestPull = {};
            for (let id in allObjects) {
                const obj = allObjects[id];
                if (obj.type !== "Pull") continue;
                if (obj.season !== latestSeason.id) continue;
                if (
                    !latestPull.date ||
                    new Date(obj.date) > new Date(latestPull.date)
                ) {
                    latestPull = obj;
                }
            }
            newState.pull = latestPull.id;

            let latestClass = {};
            for (let id in allObjects) {
                const obj = allObjects[id];
                if (obj.type !== "Class") continue;
                if (obj.pull !== latestPull.id) continue;
                if (!latestClass.weight) {
                    latestClass = obj;
                    continue;
                }
                if (obj.weight < latestClass.weight) {
                    latestClass = obj;
                }
                if (obj.category > latestClass.category) {
                    latestClass = obj;
                }
                if (obj.speed < latestClass.speed) {
                    latestClass = obj;
                }
            }
            newState.class = latestClass.id;
        }
        this.setState(newState);
    };

    doneMounting() {
        const that = this;
        this.setState({ loading: true });
        fetch(this.server_host + "/api/objects", { credentials: "include" })
            .then(response => {
                return response.json();
            })
            .then(allObjects => {
                this.setUp(allObjects);
            })
            .catch(err => {
                that.setState({ loading: false });
                alert("Failed to get data");
            });
    }

    updatePageWidth() {
        this.setState({
            sideExpanded: window.innerWidth > 1056,
            smallWindow: window.innerWidth < 600
        });
    }

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
        this.updatePageWidth();
        window.addEventListener("resize", this.updatePageWidth.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updatePageWidth.bind(this));
    }

    render() {
        return (
            <div
                className={
                    "container " +
                    (this.state.sideExpanded
                        ? "containerSideExpanded"
                        : "containerSideCollapsed")
                }
            >
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
                            {this.state.canEdit ? (
                                <SideNavLink renderIcon={Edit20} href="/edit">
                                    Edit
                                </SideNavLink>
                            ) : null}
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
                                Edit
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
