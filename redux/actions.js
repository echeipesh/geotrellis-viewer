import fetch from 'isomorphic-fetch'

var actions = {

  showLayer: function (url) {
    return {
      type: 'SHOW_LAYER',
      url: url
    }
  },

  loadCatalogRequest: function(url) {
    return {
      type: 'LOAD_CATALOG_REQEST',
      url: url
    }
  },
  loadCatalogSuccess: function(url, catalog) {
    return {
      type: 'LOAD_CATALOG_SUCCESS',
      url: url,
      catalog: catalog
    }
  },
  loadCatalogFailure: function(url, error) {
    return {
      type: 'LOAD_CATALOG_ERROR',
      url: url,
      error: error
    }
  },
  fetchCatalog: function (url) {
    return dispatch => {
      dispatch(actions.loadCatalogRequest(url))
      console.log("FETCH CATALOG", url + "/catalog")
      return fetch(url + "/catalog")
        .then(
          response => {
            response.json().then( json => {
              dispatch(actions.loadCatalogSuccess(url, json))
            })
          },
          error => dispatch(actions.loadCatalogFailure(url, error))
        )
    }
  },
  showLayerWithBreaks: function(layerUrl, breaksUrl) {
    return dispatch => {
      return fetch(breaksUrl)
        .then(
          response => {
            response.blob().then( breaks =>
              dispatch(showLayer(layerUrl + "&breaks=" + breaks))
            )
          },
          error => {}
        )
      }
  }
};

module.exports = actions;
