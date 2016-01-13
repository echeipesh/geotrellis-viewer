var reducer = function (state, action) {

  switch (action.type) {
    case 'SHOW_LAYER':
      console.log("SHOW_LAYER", action.url)
      return Object.assign({}, state, {
        map: {
          url: action.url
        }
      });

    default:
      return state;
  }
};

module.exports = reducer;
