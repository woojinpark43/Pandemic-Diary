import "./styles.css";
import React from "react";

import ChatMessage from "./ChatMessage";
import ChatMessageForm from "./ChatMessageForm";

/**
 * Used to display chatmessages
 *
 * Props:
 * - currentUser: user currently logged in otherwise null
 */
class ChatMessages extends React.Component {
    state = {
        maxId: 0,
        chatmessages: [],
    };

    componentDidMount() {
        this.updateChatMessage(this);
        this.setState({
            maxId: this.state.maxId + 1,
        });
        this.interval = setInterval(() => this.updateChatMessage(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    //get current time in string
    getCurrentTime() {
        const currTime = new Date().toLocaleString();
        return currTime;
    }

    //add new chatmessage
    addNewChatMessage(chatmessage) {
        if (this.props.user === null) {
            return;
        }

        const currentTime = this.getCurrentTime();

        if (this.props.user != null) {
            //add current time at the and to ensure every valuse is unique so we don't get E11000 error
            const username = this.props.user.concat("\\\\split@" + currentTime);
            const content = chatmessage.concat("\\\\split@" + currentTime);

            const newChatMessage = { username: username, content: content };

            fetch("/chatmessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newChatMessage),
            }).then((res) => {
                this.updateChatMessage();
            });
        }
    }

    //get chatmessage from server
    updateChatMessage() {
        fetch("/chatmessage")
            .then((res) => {
                if (res.status === 200) {
                    // return a promise that resolves with the JSON body
                    return res.json();
                }
            })
            .then((json) => {
                this.setState({
                    chatmessages: json.chatmessages.map((t) => {
                        return {
                            username: t.username.split("\\\\split@")[0], // Get rid of current time at end
                            content: t.content.split("\\\\split@")[0], // Get rid of current time at end
                        };
                    }),
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <>
                <div className="chatmessage_container">
                    {/* print a chatmessage component for every chatmessage */}
                    {this.state.chatmessages.map((chatmessage, i, arr) => (
                        <ChatMessage key={i} chatmessage={chatmessage} isLast={i === arr.length - 1} />
                    ))}
                </div>
                {this.props.user ? (
                    <ChatMessageForm addNewChatMessage={this.addNewChatMessage.bind(this)} />
                ) : (
                    <div
                        style={{
                            height: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        Please sign in to use this feature.
                    </div>
                )}
            </>
        );
    }
}

export default ChatMessages;
