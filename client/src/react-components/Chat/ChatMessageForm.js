import React from "react";
import "./styles.css";

/**
 * generate chatmessages
 *
 * Props: 
 * - addNewChatMessage: function to add new chatmessages
 */
class ChatMessagesForm extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    render() {
        return (
            <div className="add_chatmessage_container">
                <input
                    ref={this.inputRef}
                    autoComplete="false"
                    id="chatmessage_context"
                    type="text"
                    name="new_chatmessage"
                    alt="add comments"
                />
                <button
                    className="addButton"
                    onClick={() => {
                        let formVal = this.inputRef.current.value;
                        if (formVal === "") {
                            return;
                        }
                        this.props.addNewChatMessage(formVal);
                        this.inputRef.current.value = "";
                    }}>
                    <i className="fas fa-plus"></i>
                    Send Message
                </button>
            </div>
        );
    }
}
export default ChatMessagesForm;
