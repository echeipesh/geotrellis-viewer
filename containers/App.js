import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../redux/actions'
import Leaflet from '../components/Leaflet'
import Catalog from '../components/Catalog'
import MapViews from '../components/MapViews'
import _ from 'lodash'

import "bootstrap-webpack"


var App = React.createClass({

  render: function() {
    return (
      <div className="row">

        <div className="col-md-9">
          <Leaflet url={this.props.map.url} />
        </div>

        <div className="col-md-3">
          <Catalog
            defaultUrl={this.props.rootUrl}
            onSubmit={url => this.props.actions.fetchCatalog(url)} />
          <MapViews
            rootUrl={this.props.rootUrl}
            layers={ _.filter(this.props.catalog.layers, layer => {return layer.isLandsat}) }
            showLayer={this.props.actions.showLayer}
            showLayerWithBreaks={this.props.actions.showLayerWithBreaks} />
        </div>

      </div>
    )
  }
});

var mapStateToProps = function (state) {
  return state;
};

var mapDispatchToProps = function (dispatch) {
  return { // binding actions triggers dispatch on call
    actions: bindActionCreators(actions, dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
