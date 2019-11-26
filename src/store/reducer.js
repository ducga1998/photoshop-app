import { combineReducers } from 'redux';

import authenticateReducer from './authenticate/reducer';
import imageStoreReduce from './ImageStore/reducer';
const rootReducer = combineReducers({
  authenticate: authenticateReducer,
  imageStore: imageStoreReduce,
});

export default rootReducer;
