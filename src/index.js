import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {createStore, applyMiddleware} from "redux";
import {Provider} from 'react-redux';
import routes from "base/routes";
import thunk from "redux-thunk";
import {rootReducer} from "base/reducers";
import { syncHistoryWithStore } from 'react-router-redux';

const store = createStore(rootReducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(browserHistory, store)

const childRoutes = routes(store);

// Create an enhanced history that syncs navigation events with the store

ReactDOM.render((
  <Provider store={store}>
    <Router children={childRoutes} history={history} />
  </Provider>
), document.getElementById('root'));
