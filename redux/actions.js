var actions = {

  showLayer: function (url) {
    return {
      type: 'SHOW_LAYER',
      url: url
    }
  }
};

module.exports = actions;
