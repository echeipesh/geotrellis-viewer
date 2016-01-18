import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import Leaflet from '../components/Leaflet';
import Catalog from '../components/Catalog';
import Panels from '../components/Panels';
import _ from 'lodash';

import "bootstrap-webpack";

var App = React.createClass({

  render: function() {
    return (
      <div className="row">

        <div className="col-md-9">
          <Leaflet url={this.props.map.url} bounds={this.props.map.bounds} />
        </div>

        <div className="col-md-3" >
          <div style={{"paddingRight": "10px", "paddingTop": "10px"}}>
          <Catalog
            defaultUrl={this.props.rootUrl}
            bounds={this.props.map.bounds}
            onSubmit={url => this.props.actions.fetchCatalog(url)} />
          <Panels
            rootUrl={this.props.rootUrl}
            layers={this.props.catalog.layers }
            showExtent={this.props.actions.showExtent}
            showLayer={this.props.actions.showLayer}
            showLayerWithBreaks={this.props.actions.showLayerWithBreaks} />
          </div>
        </div>

      </div>
    );
  }
});

var mapStateToProps = function (state) {
  return state;
};

var mapDispatchToProps = function (dispatch) {
  return { // binding actions triggers dispatch on call
    actions: bindActionCreators(actions, dispatch)
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
