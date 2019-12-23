import { combineReducers } from 'redux';

import authenticateReducer from './authenticate/reducer';
import imageStoreReduce from './imageStore/reducer';
const rootReducer = combineReducers({
  authenticate: authenticateReducer,
  imageStore: imageStoreReduce,
});

export default rootReducer;
