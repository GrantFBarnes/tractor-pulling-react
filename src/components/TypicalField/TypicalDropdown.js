import React from "react";
import { Dropdown } from "carbon-components-react";
import TypicalField from "../TypicalField";

class TypicalDropdown extends TypicalField {
    getDropdownItems = () => {
        let items = this.props.items ? this.props.items : [];
        items.push({ id: "", display: "(Blank)" });
        return items;
    };

    itemToString = item => {
        if (item) return item.display;
        return "";
    };

    selectedItem = () => {
        for (let i in this.props.items) {
            if (this.props.items[i].id === this.state.value) {
                return this.props.items[i];
            }
        }
        return { id: "", display: this.state.value };
    };

    getContent() {
        const id = this.props.obj.id + "*" + this.props.field;
        return (
            <Dropdown
                label={this.props.title ? this.props.title : ""}
                id={id}
                light={false}
                className="typical_input"
                items={this.getDropdownItems()}
                itemToString={this.itemToString}
                selectedItem={this.selectedItem()}
                initialSelectedItem={this.selectedItem()}
                onChange={e => {
                    if (!e.selectedItem) e.selectedItem = { id: "" };
                    this.props.handleUpdate({
                        target: { id: id, value: e.selectedItem.id }
                    });
                }}
            />
        );
    }
}

export default TypicalDropdown;
