import React, { Component } from "react";
import "./styles.css";

/**
 * User login functionality
 *
 * Props:
 * - loginCallback: calls the login callback function
 * - goToSignup: function to set states for the sign up
 */
export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            loginMessage: "",
        };

        this.handleChange = this.handleChange.bind(this);
    }

    usernameRef = React.createRef();
    passwordRef = React.createRef();

    componentDidUpdate() {
        if (this.props.shouldClear) {
            this.usernameRef.current.value = "";
            this.passwordRef.current.value = "";
            this.props.onPopupExit();
        }
    }

    //try login if user presses enter
    keyPressed(e) {
        if (e.key === "Enter") {
            this.loginAttempt();
        }
    }

    //update the value of username and password of this state
    handleChange(event) {
        if (event.target.name === "username") this.setState({ username: event.target.value });
        else if (event.target.name === "password") this.setState({ password: event.target.value });
    }

    //run callback function when user tries to login
    loginAttempt = () => {
        fetch("/login", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "manual",
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        })
            .then((res) => {
                const type = res.headers.get("content-type");
                if (type && type.indexOf("application/json") !== -1) {
                    return res.json().then((data) => {
                        this.props.onLoginSuccess(data.username);
                    });
                } else {
                    return res.text().then((data) => {
                        this.setState({
                            loginMessage: data,
                        });
                    });
                }
            })
            .then(() => {
                if (this.usernameRef.current) this.usernameRef.current.value = "";
                if (this.passwordRef.current) this.passwordRef.current.value = "";
            });
    };

    render() {
        return (
            <>
                <h1 className="popupBox_title">Login</h1>
                <p className="popupBox_instructions">
                    You may login to your account here. Doing so enables you to interact with other
                    users in fun ways: share content, view their diaries, and more!
                </p>
                <form className="login" action="/login" method="post">
                    <div className="login-item">
                        <label htmlFor="username">Username:</label>
                        <input
                            ref={this.usernameRef}
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={this.handleChange}
                            className="userInput"></input>
                    </div>

                    <div className="login-item">
                        <label htmlFor="password">Password:</label>
                        <input
                            ref={this.passwordRef}
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={this.handleChange}
                            onKeyPress={(event) => this.keyPressed(event)}
                            className="userInput"></input>
                    </div>

                    {this.state.loginMessage ? (
                        <span className="loginInvalidMessage">{this.state.loginMessage}</span>
                    ) : null}

                    <div className="login-buttons">
                        <button
                            type="button"
                            value="Login"
                            className="loginButton hoverOrange"
                            onClick={this.loginAttempt}>
                            Login
                        </button>

                        <button
                            type="button"
                            value="Sign In"
                            className="SignInButton hoverOrange"
                            onClick={this.props.goToSignup}>
                            Sign Up
                        </button>
                    </div>
                </form>
            </>
        );
    }
}

export default Login;
