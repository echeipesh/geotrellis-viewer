import React from 'react'
import _ from 'lodash'
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap'

//TODO: The layers should be flattened before they get here?
var MapViews = React.createClass({

  getInitialState: function () {
    if (_.isArray(this.props.layers) && this.props.layers.length > 0) {
      return {
        layerIndex: 0,
        timeIndex1: 0,
        timeIndex2: null
      }
    } else {
      return {
        layerIndex: null,
        timeIndex1: null,
        timeIndex2: null
      }
    }
  },
  handleLayerSelect: function(ev) {
    this.setState(Object.assign({}, this.state, {"layerIndex": +ev.target.value}))
  },
  handleTimeSelect: function(target, ev) {
    this.setState(Object.assign({}, this.state, {[target]: +ev.target.value}))
  },
  layer: function () {
    if (this.state.layerIndex == null) {
      return null
    } else {
      return this.props.layers[this.state.layerIndex]
    }
  },
  handleViewClick: function(ev) {
    var layer = this.layer()
    var time = layer.times[this.state.timeIndex1]
    this.props.showLayer(`${this.props.rootUrl}/tiles/${layer.name}/{z}/{x}/{y}?time=${time}&breaks=4000,26176`)
  },
  handleNDVIClick: function (ev) {
    var layer = this.layer()
    var time = layer.times[this.state.timeIndex1]
    this.props.showLayer(
      `${this.props.rootUrl}/tiles/${layer.name}/{z}/{x}/{y}?operation=ndvi&time=${time}&breaks=78,108,128,143,155,169,186,206,227,243,256,272,288,311,5346`
    )
  },
  handleWaterClick: function (ev) {
    var layer = this.layer()
    var time = layer.times[this.state.timeIndex1]
    this.props.showLayer(
      `${this.props.rootUrl}/tiles/${layer.name}/{z}/{x}/{y}?operation=ndwi&time=${time}&breaks=78,108,128,143,155,169,186,206,227,243,256,272,288,311,5346`
    )
  },
  handleWaterDiffClick: function (ev) {
    var layer = this.layer()
    var time1 = layer.times[this.state.timeIndex1]
    var time2 = layer.times[this.state.timeIndex2]

    this.props.showLayer(
      `${this.props.rootUrl}/diff/${layer.name}/{z}/{x}/{y}?operation=ndwi&time1=${time1}&time2=${time2}&breaks=78,108,128,143,155,169,186,206,227,243,256,272,288,311,5346`
    )
  },
  handleNDVIDiffClick: function (ev) {
    var layer = this.layer()
    var time1 = layer.times[this.state.timeIndex1]
    var time2 = layer.times[this.state.timeIndex2]

    this.props.showLayer(
      `${this.props.rootUrl}/diff/${layer.name}/{z}/{x}/{y}?operation=ndvi&time1=${time1}&time2=${time2}&breaks=78,108,128,143,155,169,186,206,227,243,256,272,288,311,5346`
    )
  },

  render: function() {
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
            <option disabled selected>[None]</option>
            {layerOptions}
          </Input>

          <Input type="select" label="Time" placeholder="select" value={this.state.timeIndex1}
            onChange={ev => this.handleTimeSelect("timeIndex1", ev)}>
            {layerTimes}
          </Input>

          <ButtonGroup>
            <Button onClick={this.handleViewClick}>View</Button>
            <Button onClick={this.handleNDVIClick}>NDVI</Button>
            <Button onClick={this.handleWaterClick}>Water</Button>
          </ButtonGroup>
        </Panel>
        <Panel header="Landsat Change Detection" eventKey="2">
          <Input type="select" label="Layer" placeholder="select" value={this.state.layerIndex}
            onChange={this.handleLayerSelect}>
            <option disabled selected>[None]</option>
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
            <Button onClick={this.handleNDVIDiffClick}>NDVI Change</Button>
            <Button onClick={this.handleWaterDiffClick}>Water Change</Button>
          </ButtonGroup>
        </Panel>
        <Panel header="And now the weather" evenKey="3">
        </Panel>
      </PanelGroup>
    )
  }
});

module.exports = MapViews;