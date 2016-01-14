import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from '../containers/App';

var initialState = {
  map: {
    url: "http://{s}.tiles.mapbox.com/v3/azavea.map-zbompf85/{z}/{x}/{y}.png"
    //url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  },

  catalog: {
    layers : [
      {
        name: "foo",
        times: [
          "2015-04-05T24:00",
          "2015-06-05T24:00"
        ],
        extent: [56.543, 45.54, 57.754, 84.34],
        isLandsat: false
      },
      {
        name: "LANDSAT Layer 1",
        times: [
          "2015-04-05T24:00",
          "2015-06-05T24:00"
        ],
        extent: [56.543, 45.54, 57.754, 84.34],
        isLandsat: true
      },
      {
        name: "LANDSAT Layer 2",
        times: [
          "2015-04-05T24:00",
          "2015-06-05T24:00"
        ],
        extent: [56.543, 45.54, 57.754, 84.34],
        isLandsat: true
      }


    ]
  }
}

var store =  require('../redux/store')(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
