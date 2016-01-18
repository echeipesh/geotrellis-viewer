"use strict";
import React from 'react';
import _ from 'lodash';
import { PanelGroup, Panel, Input, Button, ButtonGroup } from 'react-bootstrap';
import SingleLayer from "./SingleLayer"
import DiffLayer from "./DiffLayer"
import DiffLayers from "./DiffLayers"

var MapViews = React.createClass({
  getInitialState: function () {
    return {
      activePane: 1,
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
    let newState = _.merge({}, this.state, { activePane: +id });
    this.setState(newState);
  },
  updateState: function(target, value) {
    let newState = _merge({}, this.state, {[target]: value})
    this.setState(newState)
  },
  showExtent: function(id) {
    var self = this;
    return function() {
      if (id == self.state.activePane && self.state.autoZoom) { // if the message is from active pane, pass it on
        self.props.showExtent.apply(this, arguments)
      }
    };
  },
  showLayerWithBreaks: function (id) {
    var self = this
    return function() {
      if (id == self.state.activePane) { // if the message is from active pane, pass it on
        return self.props.showLayerWithBreaks.apply(self, arguments);
      } else {
        // console.log("Wouldn't go yonder", id, self.state.activePane, arguments)
      }
    };
  },
  componentDidUpdate: function(prevProps, prevState) {
    // force map refresh if either the pane selection changed or auto-zoom was clicked
    // this must happen after state update in order for this.showLayerWithBreaks to pass the info
    if (this.state != prevState) {
      switch (this.state.activePane) {
      case 1:
        this.refs.single.updateMap();
        break;
      case 2:
        this.refs.diff.updateMap();
        break;
      case 3:
        this.refs.layerDiff.updateMap();
      }
    }
  },
  render: function() {

    return (
    <div>
      <Input type="checkbox" label="Snap to layer extent" checked={this.state.autoZoom} onChange={this.handleAutoZoom} />
      <PanelGroup defaultActiveKey="1" accordion={true} onSelect={this.handlePaneSelect}>
        <Panel header="Single Layer" eventKey="1" id={1}>
          <SingleLayer
            ref="single"
            rootUrl={this.props.rootUrl}
            layers={this.props.layers}
            showLayerWithBreaks={this.showLayerWithBreaks(1)}
            showExtent={this.showExtent(1)} />
        </Panel>

        <Panel header="Intralayer Change Detection" eventKey="2" id={2}>
          <DiffLayer
            ref="diff"
            rootUrl={this.props.rootUrl}
            layers={this.props.layers}
            showLayerWithBreaks={this.showLayerWithBreaks(2)}
            showExtent={this.showExtent(2)} />
        </Panel>

        <Panel header="Interlayer Change Detection" eventKey="3" id={3}>
          <DiffLayers
            ref="layerDiff"
            rootUrl={this.props.rootUrl}
            layers={_.filter(this.props.layers, l => {return ! l.isLandsat})}
            showLayerWithBreaks={this.showLayerWithBreaks(3)}
            showExtent={this.showExtent(3)} />
        </Panel>

      </PanelGroup>
    </div>)
  }
});

module.exports = MapViews;
