import React from "react";
import Colors from '../../site-styles/Colors';
import "./styles.css";

/**
 * A menu with filter functionality
 *
 * Props: 
 * - selectType: a callback function to update the type of shareable to appear on map
 * - currentUser: current user using this filter
 */
class Menu extends React.Component {
    updateSelection(selectedType) {
//        this.props.selectType(selectedType);
        if(selectedType === "All"){
            this.props.getShareable(selectedType,1);
        }
        else{
            this.props.getShareable(selectedType,0);   
        }
    }

    render() {
        this.updateSelection.bind(this);
        return (
            <div className="menu-val">
                <MenuItem
                    icon={<i className="fas fa-globe"></i>}
                    text={"All"}
                    onClick={() => {
                        this.updateSelection("All");
                    }}
                />
                <MenuItem
                    icon={<i className="far fa-newspaper"></i>}
                    text="News"
                    onClick={() => {
                        this.updateSelection("News");
                    }}
                />
                <MenuItem
                    icon={<i className="fas fa-plane"></i>}
                    text="Vacation"
                    onClick={() => {
                        this.updateSelection("Vacation");
                    }}
                />
                <MenuItem
                    icon={<i className="fas fa-ellipsis-h"></i>}
                    text="Other Stuff"
                    onClick={() => {
                        this.updateSelection("Other Stuff");
                    }}
                />
            </div>
        );
    }
}

/**
 * Props: 
 *  - icon: the icon to use for this item
 *  - text: ...
 */
class MenuItem extends React.Component {
    state = {
        hover: false
    }

    render() {
        const aStyle = {
            color: this.state.hover ? Colors.textAccent1 : Colors.textColorLight,
        }

        return (
            <button className="menuItem" href={this.props.link}
                style={aStyle}
                onClick={this.props.onClick}
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
            >
                {this.props.icon}
                {this.props.text}
            </button>
        );
    }
}

export default Menu;
