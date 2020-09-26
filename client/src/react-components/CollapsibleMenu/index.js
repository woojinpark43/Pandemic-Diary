import React from "react";
import Colors from "../../site-styles/Colors";
import "./styles.css";

/**
 * A CollapsibleMenu, which can be used in any container to fill its full
 * height and 20% of its width when expanded, or no width when collapsed.
 *
 * Props:
 * - views:         the 'modes' this can display
 * - switchView:    callback function to handle switching of views
 * - position:      which side of the parent container this is placed on
 * - children:      the view to be rendered in this container
 */
class CollapsibleMenu extends React.Component {
    state = {
        collapsed: this.props.collapsed,
        maximizedSize: this.props.maxWidth || "20%",
        width: this.props.maxWidth || "20%",
    };

    /**
     * Handler method called when CollapseButton is clicked.
     */
    handleCollapse() {
        if (this.state.collapsed) {
            this.setState({ width: this.state.maximizedSize });
        } else {
            this.setState({ width: 0 });
        }

        const pref =
            this.props.position === "left"
                ? { leftMenuCollapsed: !this.state.collapsed }
                : { rightMenuCollapsed: !this.state.collapsed };
        this.setState({ collapsed: !this.state.collapsed }, () =>
            this.props.saveUserPreferences(pref)
        );
    }

    /**
     * Render the companion views this CollapsibleMenu manages.
     */
    renderViews() {
        return this.props.views.map((view, i) => {
            let icon;
            let title;
            switch (view) {
                case "filter":
                    icon = <i className="fas fa-filter"></i>;
                    title = "Filter the shareables displayed on the map by category";
                    break;
                case "info":
                    icon = <i className="fas fa-info"></i>;
                    title = "Show user info";
                    break;
                case "chat":
                    icon = <i className="fas fa-comments"></i>;
                    title = "Chat with other users";
                    break;
                case "news":
                    icon = <i className="fas fa-newspaper"></i>;
                    title = "View COVID-19 related news for the selected date";
                    break;
                default:
                    break;
            }
            return (
                <span
                    title={title}
                    style={{
                        color: view === this.props.currentView ? Colors.textAccent1 : "white",
                    }}
                    key={i}
                    onClick={() => {
                        this.props.switchView(view);
                    }}>
                    {icon}
                    {view}
                </span>
            );
        });
    }

    render() {
        const dynamicStyles = {
            container: {
                width: this.props.collapsed ? 0 : this.state.maximizedSize,
                backgroundColor: "#416E8E", //Colors.background,
                color: Colors.textColorLight,
            },
        };

        return (
            <div className="collapsible-menu" style={dynamicStyles.container}>
                <div className="menu-views">{this.renderViews()}</div>
                {this.props.children}
                <CollapseButton
                    position={this.props.position === "left" ? "right" : "left"}
                    collapsed={this.state.collapsed}
                    onClick={this.handleCollapse.bind(this)}
                />
            </div>
        );
    }
}

/**
 * A CollapseButton which triggers an event in the parent CollapsibleMenu.
 *
 * Props:
 * - position:      the side on which this should be placed
 * - onClick:       callback function that triggers the event.
 */
class CollapseButton extends React.Component {
    state = {
        hover: false,
    };

    render() {
        const buttonStyle = {
            left: "calc(100% - 8px)",
            transform: "none",
            backgroundColor: Colors.backgroundDarkAccent,
            color: this.state.hover ? Colors.textAccent1 : Colors.textColorLight,
        };

        if (this.props.position === "left") {
            buttonStyle.left = "-6px";
            if (this.props.collapsed) {
                buttonStyle.transform = "scaleX(-1)";
                buttonStyle.left = "calc(100% - 12px)";
            }
        } else {
            if (!this.props.collapsed) {
                buttonStyle.transform = "scaleX(-1)";
            } else {
                buttonStyle.transform = "none";
                buttonStyle.left = "calc(100%)";
            }
        }

        return (
            <div
                title="Close this menu"
                onClick={this.props.onClick}
                className="collapse-button"
                style={buttonStyle}
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}>
                &#x276D;
            </div>
        );
    }
}

export default CollapsibleMenu;
