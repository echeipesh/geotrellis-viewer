"use strict";
import React from 'react';
import _ from 'lodash';
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap';
import ifAllDefined from "../utils/utils";

function updateIntraLayerDiffMap (showLayerWithBreaks, root, op, layer, t1, t2) {
  let time1 = layer.times[t1];
  let time2 = layer.times[t2];
  let opc = ((op != "none") && layer.isLandsat) ?  `&operation=${op}` : "";
  showLayerWithBreaks(
    `${root}/diff/${layer.name}/{z}/{x}/{y}?time1=${time1}&time2=${time2}${opc}`,
    `${root}/diff/breaks/${layer.name}?time1=${time1}&time2=${time2}${opc}`
  );
};

var MapViews = React.createClass({
  getInitialState: function () {
    return {
      operation: "none",
      layerId: undefined,
      timeId1: undefined,
      timeId2: undefined,
      times: {}
    };
  },
  handleLayerSelect: function(ev) {
    let layerId = +ev.target.value;
    let newState = _.merge({}, this.state, {
      "layerId": layerId,
      "timeId1": _.get(this.state.times[layerId], "timeId1", undefined),
      "timeId2": _.get(this.state.times[layerId], "timeId2", undefined),
      "times": { // Saves time selectio when switching layer
        [this.state.layerId]: {
          "timeId1": this.state.timeId1,
          "timeId2": this.state.timeId2
        }
      }
    });

    this.setState(newState);
    this.updateMap(newState);
    this.props.showExtent(this.props.layers[layerId].extent)
  },
  updateState: function(target, value) {
    let newState = _.merge({}, this.state, {[target]: value})
    this.setState(newState)
    this.updateMap(newState)
  },
  updateMap: function (state) {
    if (! state) {state = this.state};
    ifAllDefined(this.props.showLayerWithBreaks, this.props.rootUrl, state.operation, this.props.layers[state.layerId], state.timeId1, state.timeId2)
      (updateIntraLayerDiffMap)
    this.props.showExtent(this.props.layers[state.layerId].extent)
  },
  componentWillReceiveProps: function (nextProps){
  /** Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
    * The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render. */
    if ( _.isUndefined(this.state.layerId) && ! _.isEmpty(nextProps.layers)) {
      // we are blank and now is our chance to choose a layer and some times
      let newState = _.merge({}, this.state, { layerId: 0, timeId1: 0, timeId2: 1 });
      this.setState(newState);
      var layer = nextProps.layers[0];
      updateIntraLayerDiffMap(nextProps.showLayerWithBreaks, nextProps.rootUrl, this.state.operation, layer, 0, 1);
      nextProps.showExtent(layer.extent);
    }
  },
  render: function() {
    let layer       = this.props.layers[this.state.layerId];
    let isLandsat   = _.get(layer, "isLandsat", false);

    let layerOptions =
      _.map(this.props.layers, (layer, index) => {
        return <option value={index} key={index}>{layer.name}</option>;
      });

    let layerTimes =
      _.map(_.get(layer, "times", []), (time, index) => {
        return <option value={index} key={index}>{time}</option>;
      });

    return (
      <div>
        <Input type="select" label="Layer" placeholder="select" value={this.state.layerId}
          onChange={e => this.handleLayerSelect(e)}>
          {layerOptions}
        </Input>

        <Input type="select" label="Time A" placeholder="select" value={this.state.timeId1}
            onChange={e => this.updateState("timeId1", +e.target.value)}>
          {layerTimes}
        </Input>

        <Input type="select" label="Time B" placeholder="select" value={this.state.timeId2}
            onChange={e => this.updateState("timeId2", +e.target.value)}>
          {layerTimes}
        </Input>

        <Input type="select" label="Operation" placeholder="select" defaultValue="none"
            value={isLandsat ? this.state.bandOp : "none"}
            disabled={!isLandsat}
            onChange={e => this.updateState("operation", e.target.value)}>
          <option value="none">View</option>
          <option value="ndvi">NDVI</option>
          <option value="ndwi">NDWI</option>
        </Input>
      </div>
    )
  }
});

module.exports = MapViews;
