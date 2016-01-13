import React from 'react'
import _ from 'lodash'
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap'

function layerListing (layers, onlyLandsat) {
  return _
    .chain(layers)
    .map( (layer, index) => {
      // NOTE: I can pass the value field to be accessed as ev.target.value ... I will be able to zip with index here
      if ((layer.isLandsat && onlyLandsat) || !onlyLandsat)
        return [<option value={index} key={index}>{layer.name + " " + layer.time}</option>]
      else
        []
    })
    .flatten()
    .value()
};

//TODO: The layers should be flattened before they get here?
var MapViews = React.createClass({

  getInitialState: function () {
    return {
      onlyLandsat: false,
      selectedLayers: [0, 0] // TODO: this is a string, needs to be index
    }
  },
  handleFilterChange: function(ev) {
    this.setState({onlyLandsat: ev.target.checked});
  },
  handleLayerSelect: function(index, ev) {
    var newSelectedLayers = this.state.selectedLayers
    newSelectedLayers[index] = ev.target.value
    this.setState(Object.assign({}, this.state, {selectedLayers: newSelectedLayers}))
  },
  layer: function (index) {
    let layerIndex = this.state.selectedLayers[index]
    return this.props.catalog[layerIndex]
  },
  landsatDisabled: function(index) {
    let layer = this.layer(index)
    return layer == null || ! layer.isLandsat
  },
  handleViewClick: function(ev, layer) {
    console.log("View", this.layer(0))
  },
  handleNDVIClick: function (ev, layer) {
    console.log("NDVI", this.layer(0))
    // TODO: Build TMS URL for NDVI
    // How are the breaks going to happen? The showUrl function might need a breaks endpoint
    // that will do breaks. Maybe I can even roll that up in a thunk.
    this.props.showLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png")
  },
  handleWaterClick: function (ev, layer) {
    console.log("Water", this.layer(0))
    // TODO: Build TMS URL for Water
    // How are the breaks going to happen? The showUrl function might need a breaks endpoint
    // that will do breaks. Maybe I can even roll that up in a thunk.
    this.props.showLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png")
  },

  render: function() {
    console.log("Layer State", this.state)
    let layers = this.props.catalog


    // ITEM: Generate TMS URL when button is clicked
    // NOTE: I need to maintain a state of two layers that are selected
    //  That state needs to change when the drop downs are selected.
    //  This way the state of other controls can depends on what is or is not selected
    return (
      <PanelGroup defaultActiveKey="1" accordion>

        <Panel header="Change Detection" eventKey="1">
          <Input type="checkbox" label="Landsat Only" onChange={this.handleFilterChange}/>
          <hr/>
          <Input type="select" label="Layer A" placeholder="select" onChange={ev => this.handleLayerSelect(0, ev)}>
            {layerListing(layers, this.state.onlyLandsat)}
          </Input>
          <ButtonGroup>
            <Button onClick={ev => this.handleViewClick(this.layer(0))}>View</Button>
            <Button disabled={this.landsatDisabled(0)} onClick={ev => this.handleNDVIClick(ev, this.layer(0))}>NDVI</Button>
            <Button disabled={this.landsatDisabled(0)} onClick={ev => this.handleWaterClick(ev, this.layer(0))}>Water</Button>
          </ButtonGroup>
          <hr/>
          <Input type="select" label="Layer B" placeholder="select" onChange={ev => this.handleLayerSelect(1, ev)}>
            {layerListing(layers, this.state.onlyLandsat)}
          </Input>
          <ButtonGroup>
            <Button onClick={ev => this.handleViewClick(this.layer(1))}>View</Button>
            <Button disabled={this.landsatDisabled(1)} onClick={ev => this.handleNDVIClick(ev, this.layer(1))}>NDVI</Button>
            <Button disabled={this.landsatDisabled(1)} onClick={ev => this.handleWaterClick(ev, this.layer(1))}>Water</Button>
          </ButtonGroup>
          <hr/>
          <ButtonGroup>
            <Button disabled={this.landsatDisabled(0) || this.landsatDisabled(1)}>NDVI Change</Button>
            <Button disabled={this.landsatDisabled(0) || this.landsatDisabled(1)}>Water Change</Button>
          </ButtonGroup>
        </Panel>
      </PanelGroup>
    )
  }
});

module.exports = MapViews;