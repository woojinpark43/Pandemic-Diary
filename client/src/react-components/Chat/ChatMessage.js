import React from "react";
import Colors from "../../site-styles/Colors";

/**
 * display chatmessages
 *
 * Props: 
 * - key: key value of this chatmessage
 * - chatmessage: chatmessage to display
 * - isLast: boolean to indicate if this is the last chatmessage
 */
class ChatMessage extends React.Component {
    render() {
        const dynamicStyles = {
            chatmessage: {
                borderTop: '1px solid ' + Colors.textColorLight,
                borderBottom: this.props.isLast ? '1px solid ' + Colors.textColorLight: null
            }
        }
        return(
            <div style={dynamicStyles.chatmessage}>
                <h2 className="username">{this.props.chatmessage.username}</h2>
                <h3 className="content">{this.props.chatmessage.content}</h3>
            </div>
        );
    };
}

export default ChatMessage;
