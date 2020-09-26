import React from "react";
import "./style.css";

/**
 * Marker for user to display on the map
 *
 * Props:
 * - date: date on the map
 * - onClick: function to set mode to add this marker
 */
class MarkerIcon extends React.Component {
    render() {
        return (
            <img
                className="popoutButton-children"
                style={{ ...this.props.style, width: 16, height: 24 }}
                src="/marker.png"
                alt="marker"
                onClick={() => {
                    this.props.onClick(Object.assign({}, {
                        type: "marker",
                        content: "",
                        article: "News",
                    }));
                }}
            />
        );
    }
}

/**
 * A popup to change marker's content, type and date
 *
 * Props:
 * - state: currently selected marker
 * - updateDate: function to update the date of the marker to the currently selected date
 * - enterPressed: function to set the mode to normal
 * - updateArticleType: function to update the shareable's type
 * - shareableDate: date of the shareable
 * - updateCurrentDate: function to update current date
 */
class MarkerMenu extends React.Component {
    state = {
        selectedDate: this.props.currentShareable ? this.props.currentShareable.date : new Date(),
        selectedArticle: this.props.currentShareable ? this.props.currentShareable.article : "News",
        content: this.props.currentShareable ? this.props.currentShareable.content : "",
    };

    inputRef = React.createRef();

    componentDidUpdate() {
        if (this.props.shouldClear) {
            this.updateSelectedShareable();
            this.inputRef.current.value = "";
            this.props.onPopupExit();
        }
    }

    updateSelectedShareable() {
        this.props.updateSelectedShareable({
            date: this.state.selectedDate,
            article: this.state.selectedArticle,
            content: this.state.content,
        });

        this.props.returnToApp();
    }

    render() {
        return (
            <>
                <h1 className="popupBox_title">Edit your marker!</h1>
                <p className="popupBox_instructions">
                    You may enter text you'd like your marker to display here. There is a limit of
                    100 characters.
                </p>
                <textarea
                    ref={this.inputRef}
                    id="textArea"
                    className="text_area"
                    type="text"
                    maxLength="100"
                    onChange={(e) => {
                        this.setState({ content: e.target.value }, () =>
                            this.props.updateSelectedShareable({ content: this.state.content })
                        );
                    }}
                    onKeyPress={(event) => {
                        if (event.key === "Enter") this.updateSelectedShareable();
                    }}
                />

                <div className="articleType">
                    <select
                        name="article"
                        onChange={(e) => {
                            this.setState({ selectedArticle: e.target.value }, () =>
                                this.props.updateSelectedShareable({ article: this.state.selectedArticle })
                            );
                        }}>
                        <option value="News">News</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Other Stuff">Other Stuff</option>
                    </select>
                </div>
            </>
        );
    }
}

export { MarkerIcon, MarkerMenu };
