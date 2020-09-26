import React from "react";
import "./styles.css";

/**
 * Popup to display user content/ image. Also has edit, share, report and delete
 * functionality
 *
 * Props:
 * - shareable: selected shareable
 * - editable: function to change style when editing
 * - edit: function to edit shareable
 * - delete: function to delete shareable
 * - share: function to share shareable with other user
 * - report: function to report a user
 */
class ShareablePopup extends React.Component {
    render() {
        const { user, content, date, image_url } = this.props.shareable;
        const position = this.props.position;

        return (
            <div
                className="selectedShareable"
                style={{ ...this.props.style, top: position.y, left: position.x }}>
                <div className="selectedShareable_buttons">
                    <h3 className="header-style">{user}</h3>
                    <button
                        className="deleteButton"
                        title="Delete this shareable"
                        style={{visibility: this.props.editable ? "visible" : "hidden"}}
                        onClick={() => this.props.delete(this.props.shareable)}>
                        <i className="fas fa-trash-alt"></i>
                    </button>
                    <button
                        className="editButton"
                        title="Edit this shareable"
                        style={{visibility: this.props.editable ? "visible" : "hidden"}}
                        onClick={this.props.edit}>
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        className="shareButton"
                        title="Share this shareable with another user"
                        style={{visibility: this.props.editable ? "visible" : "hidden"}}
                        onClick={this.props.share}>
                        <i className="fas fa-share-square"></i>
                    </button>
                    <button
                        className="reportButton"
                        title="Report this shareable to the administrators. It will be reviewed"
                        style={{visibility: this.props.editable ? "visible" : "hidden"}}
                        onClick={this.props.report}>
                        <i className="fas fa-flag"></i>
                    </button>
                </div>
                <div>
                    <span>
                        <span className="content">{new Date(date).toDateString()}</span>
                        <br></br>
                        {content || <img style={{width: "100%"}} src={image_url} alt=""/>}
                    </span>
                </div>
            </div>
        );
    }
}

export default ShareablePopup;
