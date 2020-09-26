import React from "react";
import { isBrowser } from "react-device-detect";
import Colors from "../../site-styles/Colors";
import "./styles.css";

// Variables for the appearance of the canvas.
const canvasSettings = {
    xspace: 12,
    lineWidth: 0.2,
};

/**
 * Used in the Timeline to display the user-selected date.
 *
 * Props:
 * - xpos: current location of the cursor.
 * - ypos: current height to render this date at.
 */
class TimelineDate extends React.Component {
    render() {
        return (
            <span
                className="timelineDate"
                style={{
                    ...this.props.style,
                    top: `calc(100% - ${(isBrowser ? 4 : 2.5) * this.props.ypos}px)`,
                    left: this.props.xpos,
                    backgroundColor: Colors.backgroundDarkAccent,
                    color: Colors.textColorLight,
                }}>
                {this.props.date.toDateString()}
            </span>
        );
    }
}

/**
 * A Timeline, used to select a date which is crucial to user interactions
 * across the application.
 *
 * Props:
 *  - minDate:              the earliest date to be displayed
 *  - currentDate:          the current date; at this position, a popup is displayed
 *  - maxDate:              the latest date to be displayed
 *  - updateCurrentDate:    callback function used to update date elsewhere
 */
class Timeline extends React.Component {
    flashIfNotInteracted; // Notify the user that they should use this
    constructor(props) {
        super(props);

        this.state = {
            currentPos: -120,
            mouseDown: !isBrowser,
            hover: true,
            timelineDate_ypos: 0,
            currentDate: this.props.currentDate,
        };

        // Don't require tap-and-hold on mobile devices.
        this.timelineBehaviour = {
            onMouseDown: null,
            onMouseUp: null,
        };

        if (isBrowser) {
            this.timelineBehaviour.onMouseDown = () => this.setState({ mouseDown: true });
            this.timelineBehaviour.onMouseUp = () => {
                this.setState({ mouseDown: false });
                this.props.updateCurrentDate(this.state.currentDate);
            };
        } else {
            this.timelineBehaviour.onMouseUp = () => {
                this.props.updateCurrentDate(this.state.currentDate);
            };
        }

        this.canvasRef = React.createRef();
    }

    render() {
        return (
            <div
                title="Change the current date for the app. Refreshes shareables, news, and tweets."
                style={{
                    position: 'relative',
                    height: "40px", 
                    backgroundColor: !this.state.hover
                        ? Colors.background
                        : Colors.backgroundDarkAccent,
                    transition: "all 0.3s",
                    flexGrow: 1,
                    margin: "0px 10px 10px 10px",
                    borderRadius: "5px",
                    border: "solid 1px #002f44",
                }}>
                <span
                    className="timelineInstructions"
                    style={{
                        visibility: this.flashIfNotInteracted ? "visible" : "hidden",
                        color: Colors.textColorLight,
                    }}>
                    <i className="fas fa-info"></i>
                    To interact with the timeline, click and hold here!
                    <i className="fas fa-info"></i>
                </span>
                <TimelineDate
                    style={{
                        visibility:
                            !this.state.hover && !this.flashIfNotInteracted ? "hidden" : "visible",
                    }}
                    date={this.state.currentDate}
                    xpos={this.state.currentPos}
                    ypos={this.state.timelineDate_ypos}
                    state={this.props.state}
                />
                <canvas
                    ref={this.canvasRef}
                    className="timeline"
                    {...this.timelineBehaviour}
                    onMouseMove={this.handleMouseOver.bind(this)}
                    onMouseEnter={() => {
                        this.setState({ hover: true });
                    }}
                    onMouseLeave={() => {
                        this.setState({ hover: false });
                    }}
                />
            </div>
        );
    }

    /**
     * Initialize/kill things as necessary on mount and unmount. These are
     * React lifecycle methods to avoid memory leaks by updating canvas.
     */
    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.flashIfNotInteracted = setInterval(() => {
            this.setState({ hover: !this.state.hover });
        }, 500);
        this.initializeCanvas();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        this.setState = () => {
            return;
        };
    }

    /**
     * Update the canvas dimensions; used when dimension changes.
     */
    updateDimensions = () => {
        this.initializeCanvas();
    };

    // Draw an empty canvas with only the bar on it.
    initializeCanvas = () => {
        const ctx = this.canvasRef.current.getContext("2d");
        ctx.canvas.width = this.canvasRef.current.offsetWidth;
        ctx.canvas.height = this.canvasRef.current.offsetHeight;
        this.setState({
            timelineDate_ypos: ctx.canvas.height,
        });

        ctx.strokeStyle = Colors.backgroundLightAccent;
        ctx.lineCap = "round";
        ctx.lineWidth = canvasSettings.lineWidth;
        for (let i = 0; i < ctx.canvas.width; i += canvasSettings.xspace) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, ctx.canvas.height);
            ctx.closePath();
            ctx.stroke();
        }
    };

    /**
     * Update the current position given by the user's interaction with the
     * canvas at position 'xpos'.
     */
    updateCurrent(xpos) {
        const ctx = this.canvasRef.current.getContext("2d");

        ctx.strokeStyle = Colors.textAccent1;
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(this.state.currentPos + 25, 0);
        ctx.lineTo(this.state.currentPos + 25, ctx.canvas.height);
        ctx.closePath();
        ctx.stroke();

        // Require one of these conditions to interact with Timeline.
        if (!this.state.mouseDown && !this.state.flashIfNotInteracted) {
            return;
        }
        const daysBetween = Math.round(
            Math.abs((this.props.maxDate - this.props.minDate) / (24 * 60 * 60 * 1000))
        );

        const tempDate = new Date(this.props.minDate);
        tempDate.setDate(this.props.minDate.getDate() + (xpos / ctx.canvas.width) * daysBetween);
        this.setState({
            currentPos: xpos - 25,
            currentDate: tempDate,
        });
    }

    // Update position with the user's last interaction at position described by 'e'.
    handleMouseOver(e) {
        clearInterval(this.flashIfNotInteracted);
        this.flashIfNotInteracted = false;

        const ctx = this.canvasRef.current.getContext("2d");
        const x = e.clientX - e.target.getBoundingClientRect().left;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.initializeCanvas();
        this.updateCurrent(x);
    }
}

export default Timeline;
