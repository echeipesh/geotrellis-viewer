import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css"

var Leaflet = React.createClass({
  render: function() {
    const position = [51.505, -0.09];
    const style = {
      minHeight: "800px", width: "100%"
    }

    return (
      <Map center={position} zoom={13} style={style}>
        <TileLayer
          url={this.props.url}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    )
  }
});

module.exports = Leaflet;
