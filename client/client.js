import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from '../containers/App';

var initialState = {
  rootUrl: "http://localhost:8088",

  map: {
    url: [],
    bounds: [[36.56260003738548,-123.53027343749999],[38.22091976683121,-120.58593749999999]] // California
  },

  catalog: {
    layers : []
  }
}

var store =  require('../redux/store')(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
