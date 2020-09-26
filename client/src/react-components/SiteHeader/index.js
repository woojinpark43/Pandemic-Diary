import React from "react";
import { Link } from "react-router-dom";
import {isBrowser} from "react-device-detect";
import "./styles.css";

/**
 * Props:
 * - children:      other elements to be placed in the SiteHeader, aside from
 *                  just the site title
 */
class SiteHeader extends React.Component {
    render() {
        return (
            <header
                style={{
                    backgroundColor: "#2a526f",
                    color: "white",
                }}>
                <Link
                    to="/">
                {isBrowser && <h1 title="Return to landing page" className="siteTitle">Pandemic 
                    <i className="fas fa-virus"></i>
                Diary</h1>}
                </Link>
                {this.props.children}
            </header>
        );
    }
}

export default SiteHeader;
