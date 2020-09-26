import React from "react";

class NotificationMenu extends React.Component {
    state = {
        searchingUsername: null,
        error: false,
    };

    submit(e) {
        fetch(`/sharing`, {
            method: "post",
            body: JSON.stringify({
                shareable: this.props.selectedShareable,
                receiverUser: this.state.searchingUsername,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    //should set some kind of successful share on front end here
                    this.props.returnToApp();
                }
            })
            .catch((err) => console.log(err));

        //TODO: when success exit out of sharing, and notifiy successful share
    }

    updateUser(e) {
        this.setState({ searchingUsername: e.target.value });
    }

    handleEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.submit(e);
        }
    }

    render() {
        return (
            <div>
                <h1 className="popupBox_title">Share</h1>
                <span className="greeting">Enter the user you'd like to share this with!</span>
                <form>
                    <input
                        type="text"
                        onChange={this.updateUser.bind(this)}
                        onKeyPress={this.handleEnter.bind(this)}
                    />
                    <button
                        type="button"
                        style={buttonStyle}
                        value="Submit"
                        onClick={this.submit.bind(this)}>
                        Submit
                    </button>
                </form>
                {this.state.error ? "User not Found" : null}
            </div>
        );
    }
}

class NotificationIcon extends React.Component {
    state = {
        shared: [],
    };

    componentDidMount() {
        this.getShared();
    }

    getShared = () => {
        const user = this.props.user;

        fetch(`/shared/${user}`)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    shared: json,
                });
            })
            .catch((err) => console.log(err));
    };

    removeShared(shareable) {
        fetch(`/deleteShare`, {
            method: "delete",
            body: JSON.stringify({
                shareableID: shareable._id,
                user: this.props.user,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    this.getShared();
                }
            })
            .catch((err) => console.log(err));
    }

    renderShared(shareable, i) {
        return (
            <div className="sharedContainer" key={i}>
                <button
                    id="remove"
                    onClick={() => {
                        this.removeShared(shareable);
                    }}>
                    <i class="fas fa-check-square"></i>
                </button>
                <div className="reportContent">
                    <p>
                        {shareable.user} - {new Date(shareable.date).toDateString()}:
                    </p>
                    {shareable.content || (
                        <img
                            style={{ width: "100%" }}
                            src={shareable.image_url}
                            alt=""
                        />
                    )}
                </div>
            </div>
        );
    }

    render() {
        return (
            <>
                <h3>Markers Shared:</h3>
                <div className="content_container">
                    {this.state.shared &&
                        this.state.shared.map((shareable, i) => this.renderShared(shareable, i))}
                </div>
            </>
        );
    }
}

const buttonStyle = {
    background: "none",
    color: "inherit",
    border: "none",
    /* font: inherit, */
    cursor: "pointer",
    outline: "inherit",
    // font-size: 1.2vw,
};

export { NotificationMenu, NotificationIcon };
