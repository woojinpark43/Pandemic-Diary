import React, { Component } from "react";
import "./styles.css";

/**
 * An admin component where it contains all the admin functionality
 *
 * Props:
 * - openUserManage: a function to handle switching current mode and current popup as 'manageUser'
 */
class Admin extends Component {
    renderPopupBox() {
        return <div style={stylePopup}>Hello</div>;
    }

    render() {
        return (
            <div className="menu-val">
                <button className="button2" onClick={this.props.openUserManage}>
                    Manage Users
                </button>
                <button className="button2" onClick={this.props.openReports}>
                    Manage Reports
                </button>
                {this.renderPopupBox()}
            </div>
        );
    }
}

const stylePopup = {
    position: "absolute",
    left: "20vw",
    top: "10vh",
    height: "100px",
};

/**
 * An admin functionality to delete users
 *
 * Props:
 * - updateShareable: a function to update shareables in the app
 */
class ManageUsers extends React.Component {
    state = {
        users: [],
        shareables: [],
    };

    componentDidMount() {
        this.getUsers(this);
        this.getShareables(this);
    }

    getShareables(manageUsers) {
        fetch("/shareables")
            .then((res) => {
                if (res.status === 200) {
                    // return a promise that resolves with the JSON body
                    return res.json();
                }
            })
            .then((json) => {
                manageUsers.setState({ shareables: json });
            })
            .catch((err) => console.log(err));
    }

    getUsers(manageUsers) {
        fetch("/users")
            .then((res) => {
                if (res.status === 200) {
                    // return a promise that resolves with the JSON body
                    return res.json();
                }
            })
            .then((json) =>
                manageUsers.setState({ users: json.users.map((u) => u.username !== "admin") })
            )
            .catch((err) => console.log(err));
    }

    //need to delete a user account and all the shareables here
    deleteUser(deleteuser) {
        const users_arr = this.state.users;

        //delete user
        users_arr.forEach(function (user) {
            if (user.username === deleteuser.username) {
                fetch(`/usersAdmin/${user._id}`, {
                    method: "delete",
                })
                    .then((res) => {
                        if (res.status === 200) {
                            this.getShareables(this);
                        }
                    })
                    .catch((err) => console.log(err));
            }
        });

        const shareables_arr = this.state.shareables;

        //delete shareable
        shareables_arr.forEach(function (s) {
            if (s.user === deleteuser.username) {
                fetch(`/shareable/${s._id}`, {
                    method: "delete",
                })
                    .then((res) => {
                        if (res.status === 200) {
                            this.getUsers(this);
                        }
                    })
                    .catch((err) => console.log(err));
            }
        });

        this.props.updateShareable();
    }

    render() {
        return (
            <div>
                <h1>Manage Users</h1>
                <div className="userContainer">
                    {/* {this.generateUsers()} */}
                    {this.state.users.map((user) => {
                        if (user.username !== "admin") {
                            return (
                                <div key={user.username} className="user-val">
                                    <span>{user.username}</span>
                                    <button
                                        onClick={(e) => {
                                            this.deleteUser(user);
                                        }}>
                                        delete
                                    </button>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    }
}

export { Admin, ManageUsers };
