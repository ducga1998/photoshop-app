import { fork } from 'redux-saga/effects';

import authenticateSaga from './authenticate/saga';

import ImageStoreSaga from './ImageStore/saga';
export default function* rootSaga() {
  yield fork(authenticateSaga);
  yield fork(ImageStoreSaga);
}
