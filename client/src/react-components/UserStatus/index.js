import React from "react";
import "./styles.css";
import Login from "./Login";
import SignUp from "./SignUp";

/**
 * Displays user status to indicate whether the user have logged in.
 *
 * Props:
 * - currentUser: user currently logged in otherwise null
 * - openLoginMenu: a function to set current mode and current popup to login
 * - logout: a fuction to update current user as null
 */
class UserStatus extends React.Component {
    render() {
        // TODO: Get user status from server (phase 2)
        const messageStyle = { fontWeight: "bold", display: "inline" };
        const message = this.props.currentUser ? (
            <h2 className="userStatus" style={messageStyle}>
                Welcome back, {this.props.currentUser}!
            </h2>
        ) : (
            <button
                className="userStatus hoverOrange"
                type="button"
                onClick={this.props.openLoginMenu}
                style={messageStyle}>
                Login or Sign Up Here!
            </button>
        );

        const logOut = this.props.currentUser ? (
            <button className="userStatus hoverOrange" onClick={this.props.logout}>
                Log Out<i className="fas fa-sign-out-alt"></i>
            </button>
        ) : null;

        return (
            <div onClick={this.props.onClick}>
                {message}
                {logOut}
            </div>
        );
    }
}

/**
 * a popup for user to login or sign up
 *
 * Props:
 * - updateCurrentUser: function to update current user
 * - onSuccess: function to set current mode to normal
 * - addUser: function to add user
 * - users: list containing all the users
 */
class UserStatusMenu extends React.Component {
    state = {
        currentComp: "login",
    };

    render() {
        const loginComp = (
            <Login
                onLoginSuccess={(username) => {this.props.onValidationSuccess(username)}}

                goToSignup={() => {
                    this.setState({ currentComp: "signup" });
                }}
                shouldClear={this.props.shouldClear}
                onPopupExit={this.props.onPopupExit}
            />
        );
        const signupComp = (
            <SignUp
                onSignupSuccess={(username) => {this.props.onValidationSuccess(username)}}
                onSuccess={this.props.onSuccess}
                backToLogin={() => {
                    this.setState({ currentComp: "login" });
                }}
                shouldClear={this.props.shouldClear}
                onPopupExit={this.props.onPopupExit}
            />
        );

        return this.state.currentComp === "login" ? loginComp : signupComp;
    }
}

export { UserStatus, UserStatusMenu };
