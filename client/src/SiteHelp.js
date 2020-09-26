import React from "react";
import Colors from "../src/site-styles/Colors";

export const SiteHelp = (
    <>
        <h1 className="landingPage_title" style={{ color: Colors.textAccent1 }}>
            Features
        </h1>
        <p>Here are some examples of user interactions that are available:</p>
        <div className="landingPage_features_flex">
            <div>
                <p>
                    Collapsing side menus: you can click the collapse button on the side menus to
                    collapse them so that the map is larger.
                </p>
            </div>
            <div>
                <p>
                    Selecting a date to travel to: by clicking and dragging on the Timeline, you can
                    see content specific to a certain day.
                </p>
                <div>
                    <img alt="" src="/timeline.png" />
                </div>
            </div>

            <div>
                <p>Viewing News specific to a certain day</p>
                <div>
                <img alt="" src="/news.png" />
                </div>
            </div>
            <div>
                <p>
                    Adding a marker (text or image) to the map: when hovering over the PopoutButton,
                    some shareables will show up. Click them to enable the adding mode, and click
                    somewhere on the to place the marker. A popup window will appear, allowing you
                    to modify the contents of the marker you placed.
                </p>
                <div>
                <img alt="" src="/addingmarkers.gif" />
                </div>
            </div>
            <div>
                <p>
                    Categorizing markers: currently, we have certain groups you can place shareables
                    in: news, vacation, and other. With this, you can describe the current state of
                    affairs in the world or plan a vacation! Select from the filters on the left
                    side to narrow down your search.
                </p>
            </div>
            <div>
                <p>
                    Editing markers you’ve placed: currently, there is the option to share your
                    marker, edit its contents, or delete it.
                </p>
                <div>
                <img alt="" src="/editingmarkers.png" />
                </div>
            </div>
            <div>
                <p>
                    When a marker is shared with another user (by clicking the share button and
                    typing in the user’s username), the other user will see the shareable pop up in
                    their notifications box.
                </p>
                <div>
                <img alt="" src="/sharedmarkers.png" />
                </div>
            </div>
            <div>
                <p>
                    When the admin is logged in, the “Info” box in the left menu panel contains an
                    admin panel in which the administrator can view reported markers to moderate the
                    content, or delete problematic users.
                </p>
            </div>
        </div>
    </>
)
