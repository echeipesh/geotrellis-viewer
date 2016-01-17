"use strict";
import React from 'react';
import _ from 'lodash';
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap';


function updateInterLayerDiffMap (root, layer1, layer2, t1, t2) {
  return showLayerWithBreaks => {
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
  }
};

function updateIntraLayerDiffMap (root, op, layer, t1, t2) {
  return showLayerWithBreaks => {
    let time1 = layer.times[t1];
    let time2 = layer.times[t2];
    let opc = ((op != "none") && layer.isLandsat) ?  `&operation=${op}` : "";
    showLayerWithBreaks(
      `${root}/diff/${layer.name}/{z}/{x}/{y}?time1=${time1}&time2=${time2}${opc}`,
      `${root}/diff/breaks/${layer.name}?time1=${time1}&time2=${time2}${opc}`
    );
  }
};

function updateSingleLayerMap (root, op, layer, t1) {
  return showLayerWithBreaks => {
    // Single Band Calculation
    let time1 = layer.times[t1];
    let opc = ((op != "none") && layer.isLandsat) ?  `&operation=${op}` : "";
    showLayerWithBreaks(
      `${root}/tiles/${layer.name}/{z}/{x}/{y}?time=${time1}${opc}`,
      `${root}/tiles/breaks/${layer.name}?time=${time1}${opc}`
    );
  }
};

/**
 * If all the arguments given to this functio are defined it will evaluate curried function,
 * Else it will always evaluate curried function to undefined.
 */
function ifAllDefined() {
  if (! _.reduce(_.map(arguments, _.isUndefined), (a ,b) => { return a || b })){
    return f => {
      return f.apply(this, arguments)
    }
  } else {
    return f => {
      return undefined;
    }
  }
}


var MapViews = React.createClass({
  getInitialState: function () {
    return {
      activePane: 1,
      bandOp: "none",
      diffOp: "ndvi",
      layerId1: undefined, //layer A index
      layerId2: undefined, //layer B index
      time1: undefined, //time1 index in layer
      time2: undefined, //time2 index in layer
      times: {}, // maps from layerId => {timeId1 , timeId2}
      autoZoom: true
    };
  },
  handleAutoZoom: function(e) {
    let v = e.target.checked || false;
    this.setState(_.merge({}, this.state, {autoZoom: v}));
    if (v) this.props.showExtent(this.props.layers[this.state.layerId1].extent);
  },
  handlePaneSelect: function(id) {
    console.log("PANE SELECT %s", id);
    let newState = _.merge({}, this.state, { activePane: id });
    this.setState(newState);
    this.updateMap(newState);
  },
  handleLayerSelect: function(ev, target) {
    let layerId = +ev.target.value;
    let newState = _.merge({}, this.state, {
      [target]: layerId,
      "time1": _.get(this.state.times[layerId], "time1", undefined),
      "time2": _.get(this.state.times[layerId], "time2", undefined),
      "times": {
        [this.state.layerId1]: {
          "time1": this.state.time1,
          "time2": this.state.time2
        }
      }
    });

    this.setState(newState);
    this.updateMap(newState);
    if (this.state.autoZoom) this.props.showExtent(this.props.layers[layerId].extent);
  },

  handleTimeSelect: function(ev, target) {
    let newState = _.merge({}, this.state, { [target]: +ev.target.value });
    this.setState(newState);
    this.updateMap(newState);
  },
  handleBandOperationSelect: function(ev) {
    let newState = _.merge({}, this.state, { bandOp: ev.target.value });
    this.setState(newState);
    this.updateMap(newState);
  },
  handleDiffOperationSelect: function(ev) {
    let newState = _.merge({}, this.state, { diffOp: ev.target.value });
    this.setState(newState);
    this.updateMap(newState);
  },
  updateState: function(target, value) {
    let newState = _merge({}, this.state, {[target]: value})
    this.setState(newState)
    this.updateMap(newState)
  },
  selection: function (state) {
    var layer, time1, time2;
    if (state.layerId1 != undefined && ! _.isEmpty(this.props.layers)) {
      layer = this.props.layers[state.layerId1];
      time1 = layer.times[state.time1];
      time2 = layer.times[state.time2];
    }
    return [layer, time1, time2];
  },
  updateMap: function (state) {
    let [layer, time1, time2] = this.selection(state);
    console.log("ACTIVE PANE: %s", state.activePane);

    switch (+state.activePane) {
      case 1:
        ifAllDefined(this.props.rootUrl, state.bandOp, layer, state.time1)
          (updateSingleLayerMap)
          (this.props.showLayerWithBreaks);
        break;
      case 2:
        ifAllDefined(this.props.rootUrl, state.diffOp, layer, state.time1, state.time2)
          (updateIntraLayerDiffMap)
          (this.props.showLayerWithBreaks);
        break;
      case 3:
        ifAllDefined(this.props.rootUrl, layer, this.props.layers[state.layerId2], state.time1, state.time2)
          (updateInterLayerDiffMap)
          (this.props.showLayerWithBreaks);
    }
  },
  componentWillReceiveProps: function (nextProps){
  /** Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
    * The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render. */
    if ( _.isUndefined(this.state.layerId1) && ! _.isEmpty(nextProps.layers)) {

      // we are blank and now is our chance to choose a layer and some times
      let newState = _.merge({}, this.state, { layerId1: 0, layerId2: 0, time1: 0, time2: 1 });
      this.setState(newState);
      var layer = nextProps.layers[0];
      // assume we can start with Single layer map
      updateSingleLayerMap(nextProps.rootUrl, this.state.bandOp, layer, 0)(nextProps.showLayerWithBreaks);
      nextProps.showExtent(layer.extent);
    }
  },
  render: function() {
    let [layer, time1, time2] = this.selection(this.state);
    let isLandsat = _.get(layer, "isLandsat", false);

    let layerOptions =
      _.map(this.props.layers, (layer, index) => {
        return <option value={index} key={index}>{layer.name}</option>;
      });

    let climateLayerOptions =
      _.flatten(_.map(this.props.layers, (layer, index) => {
        if (layer.isLandsat) {
          return []
        } else {
          return [<option value={index} key={index}>{layer.name}</option>];
        }
      }));

    let layerTimes =
      _.map(_.get(layer, "times", []), (time, index) => {
        return <option value={index} key={index}>{time}</option>;
      });

    return (<div>
      <Input type="checkbox" label="Snap to layer extent" checked={this.state.autoZoom} onChange={this.handleAutoZoom} />
      <PanelGroup defaultActiveKey="1" accordion={true} onSelect={this.handlePaneSelect}>
        <Panel header="Single Layer" eventKey="1" id={1}>
          <Input type="select" label="Layer" placeholder="select" value={this.state.layerId1}
            onChange={e => this.handleLayerSelect(e, "layerId1")}>
            <option disabled>[None]</option>
            {layerOptions}
          </Input>

          <Input type="select" label="Time" placeholder="select" value={this.state.time1}
              onChange={ev => this.handleTimeSelect(ev, "time1")}>
            <option disabled>[None]</option>
            {layerTimes}
          </Input>

          <Input type="select" label="Operation" placeholder="select" defaultValue="none"
              value={isLandsat ? this.state.bandOp : "none"}
              disabled={!isLandsat}
              onChange={this.handleBandOperationSelect}>
            <option value="none">View</option>
            <option value="ndvi">NDVI</option>
            <option value="ndwi">NDWI</option>
          </Input>
        </Panel>


        <Panel header="Intralayer Change Detection" eventKey="2" id={2}>
          <Input type="select" label="Layer" placeholder="select" value={this.state.layerId1}
            onChange={e => this.handleLayerSelect(e, "layerId1")}>
            <option disabled>[None]</option>
            {layerOptions}
          </Input>

          <Input type="select" label="Time A" placeholder="select" value={this.state.time1}
            onChange={ev => this.handleTimeSelect(ev, "time1")}>
            <option disabled>[None]</option>
            {layerTimes}
          </Input>

          <Input type="select" label="Time B" placeholder="select" value={this.state.time2}
            onChange={ev => this.handleTimeSelect(ev, "time2") }>
            <option disabled>[None]</option>;
            {layerTimes}
          </Input>

          <Input type="select" label="Operation" placeholder="select" defaultValue="none"
              disabled={!isLandsat}
              value={isLandsat ? this.state.diffOp : "none"}
              onChange={this.handleDiffOperationSelect}>
            <option value="none">View</option>
            <option value="ndvi">NDVI Change</option>
            <option value="ndwi">NDWI Change</option>
          </Input>
        </Panel>

        <Panel header="Interlayer Change Detection" eventKey="3" id={3}>
          <Input type="select" label="Layer A" placeholder="select" value={this.state.layerId1}
            onChange={e => this.handleLayerSelect(e, "layerId1")}>
            <option disabled>[None]</option>
            {climateLayerOptions}
          </Input>

          <Input type="select" label="Layer B" placeholder="select" value={this.state.layerId2}
            onChange={e => this.handleLayerSelect(e, "layerId2")}>
            <option disabled>[None]</option>
            {climateLayerOptions}
          </Input>

          <Input type="select" label="Time A" placeholder="select" value={this.state.time1}
            onChange={ev => this.handleTimeSelect(ev, "time1")}>
            <option disabled>[None]</option>
            {layerTimes}
          </Input>

          <Input type="select" label="Time B" placeholder="select" value={this.state.time2}
            onChange={ev => this.handleTimeSelect(ev, "time2") }>
            <option disabled>[None]</option>;
            {layerTimes}
          </Input>

          <Input type="select" label="Operation" placeholder="select" defaultValue="none"
              disabled={true}>
            <option value="none">View</option>
          </Input>
        </Panel>

      </PanelGroup>
    </div>)
  }
});

module.exports = MapViews;
