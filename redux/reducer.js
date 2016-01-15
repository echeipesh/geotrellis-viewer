var reducer = function (state, action) {
  switch (action.type) {
    case 'SHOW_LAYER':
      return Object.assign({}, state, {
        map: {
          url: [action.url],
        }
      });

    case 'LOAD_CATALOG_SUCCESS': {
      return Object.assign({}, state,{
        rootUrl: action.url,
        catalog: action.catalog
      })
    }
    case 'SHOW_BOUNDS': {
      return _.merge({}, state, { map: { bounds: action.bounds } })
    }
    default:
      return state;
  }
};

module.exports = reducer;
