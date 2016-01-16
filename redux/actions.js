import fetch from 'isomorphic-fetch';

var showLayer = function (url) {
  return {
    type: 'SHOW_LAYER',
    url: url
  };
};

var actions = {

  showLayer: showLayer,

  centerMap: function (extent) {
    return {
      type: 'CENTER_MAP',
      extent: extent
    };
  },
  showBounds: function(bounds){
    return {
      type: 'SHOW_BOUNDS',
      bounds: bounds
    };
  },
  showExtent: function(extent) {
    return actions.showBounds([ [extent[0][1], extent[0][0]], [extent[1][1], extent[1][0]] ]);
  },
  loadCatalogRequest: function(url) {
    return {
      type: 'LOAD_CATALOG_REQEST',
      url: url
    };
  },

  loadCatalogSuccess: function(url, catalog) {
    return {
      type: 'LOAD_CATALOG_SUCCESS',
      url: url,
      catalog: catalog
    };
  },

  loadCatalogFailure: function(url, error) {
    return {
      type: 'LOAD_CATALOG_ERROR',
      url: url,
      error: error
    };
  },

  fetchCatalog: function (url) {
    return dispatch => {
      dispatch(actions.loadCatalogRequest(url));
      console.log("FETCH CATALOG", url + "/catalog");
      return fetch(url + "/catalog")
        .then(
          response => {
            response.json().then( json => {
              dispatch(actions.loadCatalogSuccess(url, json));
            });
          },
          error => dispatch(actions.loadCatalogFailure(url, error))
        );
    };
  },

  showLayerWithBreaks: function(layerUrl, breaksUrl) {
    return dispatch => {
      console.log("Fetching breaks", breaksUrl)
      return fetch(breaksUrl)
        .then(
          response => {
            response.json().then( breaks => {
              dispatch(actions.showLayer(layerUrl + "&breaks=" + breaks.join(",")));
            });
          },
          error => {}
        );
      };
  }
};

module.exports = actions;
