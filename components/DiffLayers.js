"use strict";
import React from 'react';
import _ from 'lodash';
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap';
import ifAllDefined from '../utils/utils.js';

function updateInterLayerDiffMap (showLayerWithBreaks, root, layer1, layer2, t1, t2) {
  let time1 = layer1.times[t1];
  let time2 = layer2.times[t2];
  // Showing second layer as a stand-in for now
  showLayerWithBreaks(
    `${root}/tiles/${layer2.name}/{z}/{x}/{y}?time=${time2}`,
    `${root}/tiles/breaks/${layer2.name}?time=${time2}`
  );

  // showLayerWithBreaks(
  //   `${root}/layer-diff/${layer1.name}/{z}/{x}/{y}?layer2={$layer2.name}&time1=${time1}&time2=${time2}`,
  //   `${root}/layer-diff/breaks/${layer1.name}?layer2={$layer2.name}&time1=${time1}&time2=${time2}`
  // );
};

var MapViews = React.createClass({
  getInitialState: function () {
    return {
      layerId1: undefined,
      layerId1time: undefined,
      layerId2: undefined,
      layerId2time: undefined,
      times: {}
    };
  },
  handleLayerSelect: function(ev, target) {
    let layerId = +ev.target.value;
    let newState = _.merge({}, this.state, {
      [target]: layerId,
      [target + "time"]: _.get(this.state.times[layerId], target + "time", undefined),
      "times": { // Saves time selectio when switching layer
        [this.state.layerId]: {
          [target + "time"]: this.state[target + "time"]
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
    ifAllDefined(this.props.showLayerWithBreaks, this.props.rootUrl, this.props.layers[state.layerId1], this.props.layers[state.layerId2], state.layerId1time, state.layerId2time)
      (updateInterLayerDiffMap)
    this.props.showExtent(this.props.layers[state.layerId1].extent)
  },
  componentWillReceiveProps: function (nextProps){
  /** Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
    * The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render. */
    if ( _.isUndefined(this.state.layerId1) && ! _.isEmpty(nextProps.layers)) {
      // we are blank and now is our chance to choose a layer and some times
      let newState = _.merge({}, this.state, {
        layerId1: 0,
        layerId1time: 0,
        layerId2: 0,
        layerId2time: 1
      });
      this.setState(newState);
      var layer = nextProps.layers[0];
      console.log("MY LAYER", layer)
      updateInterLayerDiffMap(nextProps.showLayerWithBreaks, nextProps.rootUrl, layer, layer, 0, 1);
      nextProps.showExtent(layer.extent);
    }
  },
  render: function() {
    let layer1       = this.props.layers[this.state.layerId1];
    let layer2       = this.props.layers[this.state.layerId2];

    let layerOptions =
      _.map(this.props.layers, (layer, index) => {
        return <option value={index} key={index}>{layer.name}</option>;
      });

    let layer1Times =
      _.map(_.get(layer1, "times", []), (time, index) => {
        return <option value={index} key={index}>{time}</option>;
      });

    let layer2Times =
      _.map(_.get(layer2, "times", []), (time, index) => {
        return <option value={index} key={index}>{time}</option>;
      });

    return (
      <div>
        <Input type="select" label="Layer A" placeholder="select" value={this.state.layerId1}
          onChange={e => this.handleLayerSelect(e, "layerId1")}>
          {layerOptions}
        </Input>

        <Input type="select" label="Time A" placeholder="select" value={this.state.layerId1time}
            onChange={e => this.updateState("layerId1time", +e.target.value)}>
          {layer1Times}
        </Input>

        <Input type="select" label="Layer B" placeholder="select" value={this.state.layerId2}
          onChange={e => this.handleLayerSelect(e, "layerId2")}>
          {layerOptions}
        </Input>

        <Input type="select" label="Time B" placeholder="select" value={this.state.layerId2time}
            onChange={e => this.updateState("layerId2time", +e.target.value)}>
          {layer2Times}
        </Input>
      </div>
    )
  }
});

module.exports = MapViews;
