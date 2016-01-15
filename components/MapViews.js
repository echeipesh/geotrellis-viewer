"use strict";
import React from 'react'
import _ from 'lodash'
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap'

var MapViews = React.createClass({
  getInitialState: function () {
    return {
      activePane: 1,
      bandOp: "none",
      diffOp: "ndvi",
      layer: undefined, //layer index
      time1: undefined, //time1 index in layer
      time2: undefined, //time2 index in layer
      times: {} // maps from layerId => {timeId1 , timeId2}
    }
  },
  handlePaneSelect: function(id) {
    let newState = _.merge({}, this.state, { activePane: id })
    this.setState(newState)
    this.updateMap(newState)
  },
  handleLayerSelect: function(ev) {
    let layer = +ev.target.value
    let newState = _.merge({}, this.state, {
      "layer": layer,
      "time1": _.get(this.state.times[layer], "time1", undefined),
      "time2": _.get(this.state.times[layer], "time2", undefined)
    })
    this.setState(newState)
    this.updateMap(newState)
    this.props.showExtent(this.props.layers[layer].extent)
  },
  handleTimeSelect: function(target, ev) {
    let timeId = +ev.target.value
    let newState = _.merge({}, this.state, {
        [target]: timeId,
        times: {
          [this.state.layer]: {
            [target]: timeId
          }
        }
      })
    this.setState(newState)
    this.updateMap(newState)
  },
  handleBandOperationSelect: function(ev) {
    let newState = _.merge({}, this.state, { bandOp: ev.target.value })
    this.setState(newState)
    this.updateMap(newState)
  },
  handleDiffOperationSelect: function(ev) {
    let newState = _.merge({}, this.state, { diffOp: ev.target.value })
    this.setState(newState)
    this.updateMap(newState)
  },
  selection: function (state) {
    var layer, time1, time2
    if (state.layer != undefined) {
      layer = this.props.layers[state.layer]
      time1 = layer.times[state.time1]
      time2 = layer.times[state.time2]
    }

    return [layer, time1, time2]
  },
  updateMap: function (state) {
    let [layer, time1, time2] = this.selection(state)

    // Single Band Calculation
    if (state.activePane == 1 && ! _.isEmpty(layer) && ! _.isEmpty(time1) ) {
      let op = (state.bandOp != "none") ?  `&operation=${state.bandOp}` : ""
      this.props.showLayerWithBreaks(
        `${this.props.rootUrl}/tiles/${layer.name}/{z}/{x}/{y}?time=${time1}${op}`,
        `${this.props.rootUrl}/tiles/breaks/${layer.name}?time=${time1}${op}`
      )

    // Difference Calculation
    } else if (state.activePane == 2 && ! _.isEmpty(layer) && ! _.isEmpty(time1) && ! _.isEmpty(time2) ) {
      let op = (state.diffOp != "none") ?  `&operation=${state.diffOp}` : ""
      this.props.showLayerWithBreaks(
        `${this.props.rootUrl}/diff/${layer.name}/{z}/{x}/{y}?time1=${time1}&time2=${time2}${op}`,
        `${this.props.rootUrl}/diff/breaks/${layer.name}?time1=${time1}&time2=${time2}${op}`
      )
    }
  },

  render: function() {
    let [layer, time1, time2] = this.selection(this.state)
    let isLandsat = _.get(layer, "isLandsat", false)

    let layerOptions =
      _.map(this.props.layers, (layer, index) => {
        return <option value={index} key={index}>{layer.name}</option>
      });

    let layerTimes =
      _.map(_.get(layer, "times", []), (time, index) => {
        return <option value={index} key={index}>{time}</option>
      });

    return (<div>
      <Panel header={<h3>Layer</h3>}>
        <Input type="select" placeholder="select" value={this.state.layerIndex}
          onChange={this.handleLayerSelect}>
          <option disabled>[None]</option>
          {layerOptions}
        </Input>
      </Panel>
      <PanelGroup defaultActiveKey="1" accordion onSelect={this.handlePaneSelect}>
        <Panel header="Single Layer" eventKey="1">
          <Input type="select" label="Time" placeholder="select" value={this.state.time1}
              onChange={ev => this.handleTimeSelect("time1", ev)}>
            <option disabled>[None]</option>
            {layerTimes}
          </Input>

          <Input type="select" label="Operation" placeholder="select" defaultValue="none" value={this.state.bandOp}
              onChange={this.handleBandOperationSelect}>
            <option value="none">View</option>
            <option value="ndvi">NDVI</option>
            <option value="ndwi">NDWI</option>
          </Input>
        </Panel>

        <Panel header="Layer Change Detection" eventKey="2">
          <Input type="select" label="Time 1" placeholder="select" value={this.state.time1}
            onChange={ev => this.handleTimeSelect("time1", ev)}>
            <option disabled>[None]</option>
            {layerTimes}
          </Input>

          <Input type="select" label="Time 2" placeholder="select" value={this.state.time2}
            onChange={ev => this.handleTimeSelect("time2", ev)}>
            <option disabled>[None]</option>
            {layerTimes}
          </Input>

          <Input type="select" label="Operation" placeholder="select" defaultValue="none" value={this.state.diffOp}
              onChange={this.handleDiffOperationSelect}>
            <option value="none">View</option>
            <option value="ndvi">NDVI Change</option>
            <option value="ndwi">NDWI Change</option>
          </Input>
        </Panel>
      </PanelGroup>
    </div>)
  }
});

module.exports = MapViews;