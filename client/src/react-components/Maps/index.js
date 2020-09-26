import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React from "react";

const options = {
    fullscreenControlOptions: { position: 6 },
    zoomControlOptions: { position: 6 },
    controlSize: 24,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    draggableCursor: "inherit",
};

class Maps extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            center: {
                lat: 43.6623,
                lng: -79.3932,
            },
            markers: [],
            isGoogleMapsAPILoaded: false,
        };
    }

    handleClick(e) {
        if (this.props.inAddMode) {
            this.props.updateSelectedShareable({
                center: Object.keys(e.latLng).reduce((newCoords, pos) => ({ ...newCoords, [pos]: e.latLng[pos].call() }), {})
            });
            this.props.onShareablePlaced();
        }
    }

    drawMarkers() {
        return this.props.children
            .map((child) => {
                if (!Array.isArray(child)) {
                    return child;
                } else {
                    return child.map((c) => {
                        const t = React.cloneElement(c, {});
                        t.props.options.icon.scaledSize = new window.google.maps.Size(20, 30);
                        this.state.markers.push(t);
                        return t;
                    });
                }
            })
            .flat(1);
    }

    render() {
        return (
            <LoadScript
                googleMapsApiKey="AIzaSyCEheP30PI_xivf3iqo6zpcaQ9zRBt558Y"
                onLoad={() => {
                    this.setState({ isGoogleMapsAPILoaded: true });
                }}>
                <GoogleMap
                    onLoad={(map) => {
                        this.props.bindMap(map);
                    }}
                    mapContainerStyle={{
                        height: "100%",
                        width: "100%",
                    }}
                    onZoomChanged={this.props.onZoomOrDrag}
                    onDrag={this.props.onZoomOrDrag}
                    center={this.state.center}
                    zoom={10}
                    onClick={this.handleClick.bind(this)}
                    options={options}>
                    {this.state.isGoogleMapsAPILoaded && this.drawMarkers()}
                </GoogleMap>
            </LoadScript>
        );
    }
}

export default Maps;
