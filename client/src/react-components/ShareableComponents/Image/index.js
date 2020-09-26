import React from "react";
import "./style.css";

/**
 * Image for user to display on the map
 *
 * Props:
 * - date: date on the map
 * - onClick: function to set mode to add this marker
 */
class ImageIcon extends React.Component {
    render() {
        return (
            <img
                className="popoutButton-children"
                alt="_image"
                style={{ ...this.props.style, height: 20, width: 20 }}
                src="/image.png"
                onClick={() =>
                    this.props.onClick(
                        Object.assign(
                            {},
                            {
                                type: "image",
                                image_url: "",
                            }
                        )
                    )
                }
            />
        );
    }
}

/**
 * A popup to change image, type and date
 *
 * Props:
 * - image: currently selected image
 * - updateDate: function to update the date of the image to the currently selected date
 * - updateArticleType: function to update shareable's type
 * - shareableDate: date of the shareable
 * - updateCurrentDate: function to update current date
 */
class ImageMenu extends React.Component {
    state = {
        selectedDate: this.props.currentShareable ? this.props.currentShareable.date : new Date(),
        selectedArticle: this.props.currentShareable ? this.props.currentShareable.article : "News",
    };

    inputRef = React.createRef();

    componentDidUpdate() {
        if (this.props.shouldClear) {
            this.updateSelectedShareable();
            this.props.onPopupExit();
        }
    }

    updateImageForm(e) {
        this.props.updateImageForm(this.inputRef.current.form);
    }

    render() {
        return (
            <>
                <h1 className="popupBox_title">Image Selector</h1>
                <p className="popupBox_instructions">
                    Select an image to add to this image marker you've placed. It will be displayed
                    when you hover over the marker.
                </p>
                <form action="image upload">
                    <input
                        ref={this.inputRef}
                        type="file"
                        accept="image/*"
                        name="fileupload"
                        id="fileupload"
                        onChange={this.updateImageForm.bind(this)}
                    />
                </form>

                <div className="articleType">
                    <select
                        name="article"
                        title="Change the category you'd like to place this shareable in"
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

export { ImageIcon, ImageMenu };
