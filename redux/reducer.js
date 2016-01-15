var reducer = function (state, action) {
  switch (action.type) {
    case 'SHOW_LAYER':
      return Object.assign({}, state, {
        map: {
          url: [action.url],
          bounds: [action.bounds]
        }
      });

    case 'LOAD_CATALOG_SUCCESS': {
      return Object.assign({}, state,{
        rootUrl: action.url,
        catalog: action.catalog
      })
    }
    default:
      return state;
  }
};

module.exports = reducer;
