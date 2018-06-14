import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { globalData } from './globalData';


let rootReducer = combineReducers({
  globalData: globalData,
  routing: routerReducer
});

export { rootReducer };
