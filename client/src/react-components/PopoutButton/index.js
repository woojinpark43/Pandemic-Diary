import React from "react";
import "./styles.css";
import Colors from "../../site-styles/Colors";

/**
 * Parameters for every PopoutButton. These are dynamic styles used in code,
 * hence they appear inline in the HTML.
 */
const childSettings = {
    distToChild: 64,
    childRadius: 8,
};

const containerStyles = {
    position: "absolute",
    height: 48,
    width: 48,
    distToViewport: 16,
    paddingTop: childSettings.distToChild,
    paddingLeft: childSettings.distToChild,
};

const buttonStyles = {
    backgroundColor: Colors.background,
    color: Colors.textColorLight,
};

/**
 * A PopoutButton, which can be placed on a corner of a container. It renders
 * children as small icons that can be clicked to perform some action, popping
 * them out whenever the user hovers over them.
 *
 * Props:
 *  - position: where the button should be placed relative to the parent
 */
class PopoutButton extends React.Component {
    state = {
        hover: false,
    }

    /**
     * Get the (x, y) position, relative to the parent container, of where the
     * i-th child should be placed such that all n children are visible when
     * the PopoutButton is hovered over.
     */
    getChildPos(i) {
        // Effective radius on the arc of the circle.
        const radius = childSettings.distToChild + containerStyles.width / 2;

        // Number of children to be placed.
        const nChildren = this.props.children.length;

        // Calculate the adjusted angle by dividing the arc into segments.
        let angle;
        if (nChildren > 1) {
            angle = (Math.PI / 2 / (nChildren - 1)) * i;
        } else {
            angle = 45;
        }

        // Basic trig to get the final coordinates.
        const ret = [Math.cos(angle) * radius, Math.sin(angle) * radius];
        if (this.props.position === "top-right") {
            ret[1] = -ret[1] + childSettings.distToChild;
        }
        return ret;
    }

    /**
     * Render all children components in their appropriate positions.
     */
    renderChildren() {
        return React.Children.toArray(this.props.children).map((child, i) => {
            const childPos = this.getChildPos(i);
            return React.cloneElement(child, {
                key: i.toString(),
                radius: childSettings.childRadius,
                pos: this.getChildPos(i),
                style: {
                    ...child.props.style,
                    right: this.state.hover ? childPos[0] : 16,
                    bottom: this.state.hover
                        ? childPos[1]
                        : this.props.position === "top-right"
                        ? containerStyles.distToViewport + childSettings.distToChild
                        : containerStyles.distToViewport,
                    visibility: this.state.hover ? "visible" : "hidden",
                },
            });
        });
    }

    render() {
        const popoutButtonStyles = {
            position: "absolute",
        };
        const buttonStylesCopy = Object.assign({}, buttonStyles);

        if (this.props.position === "top-right") {
            popoutButtonStyles.top = containerStyles.distToViewport;
            popoutButtonStyles.right = containerStyles.distToViewport;
            buttonStylesCopy.top = 0;
        } else if (this.props.position === "bottom-right") {
            popoutButtonStyles.bottom = containerStyles.distToViewport;
            popoutButtonStyles.right = containerStyles.distToViewport;
            buttonStylesCopy.bottom = 0;
        } else {
            return <span>INVALID PopoutButton POSITION</span>;
        }

        return (
            <div className="popoutButton-container"
                //temp added bottom and right here to fit look
                style={{ ...popoutButtonStyles, ...containerStyles, bottom: "25px", right: "25px" }}
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
            >
                <span className="popoutButton" style={buttonStylesCopy}><i className="fas fa-plus"></i></span>
                {this.renderChildren()}
            </div>
        );
    }
}

export default PopoutButton;
