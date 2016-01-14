import React from 'react'
import _ from 'lodash'
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap'

//TODO: The layers should be flattened before they get here?
var MapViews = React.createClass({

  getInitialState: function () {
    return {
      layerIndex: null,
      timeIndex1: null,
      timeIndex2: null
    }
  },
  handleLayerSelect: function(ev) {
    this.setState(Object.assign({}, this.state, {"layerIndex": +ev.target.value}))
  },
  handleTimeSelect: function(target, ev) {
    this.setState(Object.assign({}, this.state, {[target]: +ev.target.value}))
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
    let layers = this.props.layers
    let layer = this.props.layers[this.state.layerIndex]

    let layerOptions =
      _.map(this.props.layers, (layer, index) => {
        let selected = (index == this.state.layerIndex)
        return <option value={index} key={index}>{layer.name}</option>
      });

    let layerTimes =
      _.map(_.get(layer, "times", []), (time, index) => {
        return <option value={index} key={index}>{time}</option>
      });


    return (
      <PanelGroup defaultActiveKey="1" accordion>
        <Panel header="Landsat" eventKey="1">
          <Input type="select" label="Layer" placeholder="select" value={this.state.layerIndex}
            onChange={this.handleLayerSelect}>
            {layerOptions}
          </Input>

          <Input type="select" label="Time" placeholder="select" value={this.state.timeIndex1}
            onChange={ev => this.handleTimeSelect("timeIndex1", ev)}>
            {layerTimes}
          </Input>

          <ButtonGroup>
            <Button onClick={ev => this.handleViewClick(this.layer(0))}>View</Button>
            <Button onClick={ev => this.handleNDVIClick(ev, this.layer(0))}>NDVI</Button>
            <Button onClick={ev => this.handleWaterClick(ev, this.layer(0))}>Water</Button>
          </ButtonGroup>
        </Panel>
        <Panel header="Landsat Change Detection" eventKey="2">
          <Input type="select" label="Layer" placeholder="select" value={this.state.layerIndex}
            onChange={this.handleLayerSelect}>
            {layerOptions}
          </Input>
          <hr/>

          <Input type="select" label="Time 1" placeholder="select" value={this.state.timeIndex1}
            onChange={ev => this.handleTimeSelect("timeIndex1", ev)}>
            {layerTimes}
          </Input>

          <Input type="select" label="Time 2" placeholder="select" value={this.state.timeIndex2}
            onChange={ev => this.handleTimeSelect("timeIndex2", ev)}>
            {layerTimes}
          </Input>

          <ButtonGroup>
            <Button>NDVI Change</Button>
            <Button>Water Change</Button>
          </ButtonGroup>
        </Panel>
        <Panel header="And now the weather" evenKey="3">
        </Panel>
      </PanelGroup>
    )
  }
});

module.exports = MapViews;