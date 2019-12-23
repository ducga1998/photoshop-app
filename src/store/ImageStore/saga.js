import { call, delay, fork, put } from 'redux-saga/effects';

import imageStoreAction from './actions';
import authorizedRequest from '../../helpers/request/authorizedRequest';

export const idProject = 'p-7ubVMK7eak6da3MwH7vz5X';

function* fetchInitData() {
  yield delay(500);
  const data = yield authorizedRequest.get(
    'https://t69kla0zpk.execute-api.ap-southeast-1.amazonaws.com/dev/project/' +
      idProject,
  );
  yield put(imageStoreAction.image.initData(data));
}
function* initData() {
  yield call(fetchInitData);
}
export default function* ImageStoreSaga() {
  yield fork(initData);
}
