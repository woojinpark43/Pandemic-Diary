import React from "react";
import GoogleMapReact from "google-map-react";

import "./styles.css";

/**
 * An overlaid Canvas to facilitate the interactions with markers on the
 * map image below it. This is temporary for Phase 1 as external APIs are not
 * allowed.
 *
 * Props:
 *  - currentDate
 *  - shareables                array of shareable markers to be displayed
 *  - currentShareable          the shareable that is selected
 *  - selectedType              the type of shareable to be added
 *  - inAddMode                 whether or not the user is in add mode
 *  - addToShareableArray       callback function to add a shareable
 *  - onShareablePlaced         callback function to update state when the shareable is placed
 *  - updateSelectedShareable   callback function to edit selected shareable
 */
class Maps extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    /**
     * Compute and return the shareable at location described by 'e'.
     */
    getShareableAtLocation(e) {
        const imgRect = this.canvasRef.current.getBoundingClientRect();
        const adjX = e.pageX - imgRect.x;
        const adjY = e.pageY - imgRect.y;
        for (const marker of this.props.shareables) {
            if (
                marker.date.getFullYear() === this.props.currentDate.getFullYear() &&
                marker.date.getMonth() === this.props.currentDate.getMonth() &&
                marker.date.getDate() === this.props.currentDate.getDate()
            ) {
                if (
                    marker.x <= adjX &&
                    adjX <= marker.x + markerDimensions.width &&
                    marker.y <= adjY &&
                    adjY <= marker.y + markerDimensions.height
                ) {
                    return marker;
                }
            }
        }
    }

    /**
     * Add a shareable to the shareables array and update state variables if
     * one can be placed at location described by 'e'.
     */
    handleClick(e) {
        const shareable = this.getShareableAtLocation(e);

        if (!shareable && this.props.inAddMode) {
            const imgRect = this.canvasRef.current.getBoundingClientRect();
            const n = Object.assign({}, this.props.currentShareable);
            n.x = e.pageX - imgRect.x;
            n.y = e.pageY - imgRect.y;
            n.user = null;
            // n.selectedType = this.props.selectedType;
            n.selectedType = null;
            n.date = this.props.currentDate;
            this.props.addToShareableArray(n);
            this.props.onShareablePlaced(n.type);
        }
    }

    /**
     * Clear all markers on the map.
     */
    clearMap() {
        const ctx = this.canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /**
     * Draw shareables in 'shareables' on the map.
     */
    drawMarkers(shareables) {
        const ctx = this.canvasRef.current.getContext("2d");
        for (let s of shareables) {
            if (
                s.date.toDateString() === this.props.currentDate.toDateString() &&
                (s.selectedType === this.props.selectedType || this.props.selectedType === "All")
            ) {
                const draw = () => {
                    ctx.drawImage(s.img, s.x, s.y, s.width, s.height);
                };
                if (!s.img.complete) {
                    s.img.onload = () => {
                        draw();
                    };
                } else {
                    draw();
                }
            }
        }
    }

    componentDidUpdate() {
        this.clearMap();
        this.drawMarkers(this.props.shareables);
    }

    render() {
        return (
            <ScrollContainer className="scroll-container">
                {this.props.children}
                <canvas
                    ref={this.canvasRef}
                    onClick={this.handleClick.bind(this)}
                    onMouseMove={(e) => {
                        const shareable = this.getShareableAtLocation(e);
                        if (!shareable) {
                            return;
                        } else {
                            this.props.updateSelectedShareable(shareable);
                        }
                    }}
                    className="map-canvas"
                    width={3740} 
                    height={1700}></canvas>
                <img
                    alt="Temporary map for phase 1."
                    className="map-image"
                    src="/map.png"
                    width={3740}
                    height={1700}
                />
            </ScrollContainer>
        );
    }
}

export default Maps;
