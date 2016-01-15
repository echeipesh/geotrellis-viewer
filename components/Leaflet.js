import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, BaseTileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css"

var Leaflet = React.createClass({
  render: function() {
    const style = {
      minHeight: "800px", width: "100%"
    }
    let mapLayers = _.map(this.props.url, u => {
      return <TileLayer url={u} />
    })

    return (
      <Map center ={[37.062,-121.530]} zoom={8} style={style} maxZoom={12} bounds={this.props.bounds}>
        <TileLayer
          url="http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        />
        {mapLayers}
      </Map>
    )
  }
});

module.exports = Leaflet;
