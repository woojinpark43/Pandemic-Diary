import React, { Component } from "react";
import "./styles.css";

/**
 * displays the user info. eg) shareables this user made
 *
 * Props: 
 * - currentUser:   current user logged in
 */
export class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.renderUserInfo.bind(this);
    }

    //render user info to display
    renderUserInfo() {
        return (
            <div>
                <h3>Hello, {this.props.currentUser}! You're viewing the shareables that you've placed.</h3>
                <div className="content_container">
                    {/* there is a bug here that when a shareable is deleted
                        the mutation does not affect this array as well which causes the render here to render deleted shareables*/}
                    {/* content_container does not scroll rn */}
                    {this.props.shareables.map((shareable, i) =>
                        
                        shareable.user === this.props.currentUser ? this.renderShareable(shareable, i) : null
                    )}
                </div>
            </div>
        );
    }

    //render shareables to display
    renderShareable(shareable, i) {
        return (
            <div className="userInfoShareable" key={i}> 
                {shareable.date.split('T')[0]}: <br/>
                {shareable.content}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.currentUser == null ? (
                    <div>Please login to view user info. </div>
                ) : (
                    this.renderUserInfo()
                )}
            </div>
        );
    }
}

export default UserInfo;
