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
      return fetch(url)
        .then(
          response => {
            response.json().then( json => {
              dispatch(actions.loadCatalogSuccess(url, json))
            })
          },
          error => dispatch(actions.loadCatalogFailure(url, error))
        )
    }
  }
};

module.exports = actions;
