var reducer = function (state, action) {
  switch (action.type) {
    case 'SHOW_LAYER':
      return Object.assign({}, state, {
        map: {
          url: action.url
        }
      });

    case 'LOAD_CATALOG_SUCCESS': {
      return Object.assign({}, state,{
        catalog: action.catalog
      })
    }
    default:
      return state;
  }
};

module.exports = reducer;
