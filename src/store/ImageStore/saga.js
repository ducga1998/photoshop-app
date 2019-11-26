import { call, delay, fork, put } from 'redux-saga/effects';

import authenticateActions from './actions';
import authorizedRequest from '../../helpers/request/authorizedRequest';

const idProject = 'p-pFWrCqq5jmARDeuSLxaP8s';

function* fetchInitData() {
  yield delay(500);
  const data = yield authorizedRequest.get(
    'https://t69kla0zpk.execute-api.ap-southeast-1.amazonaws.com/dev/project/' +
      idProject,
  );
  yield put(authenticateActions.initData(data));
}
function* initData() {
  yield call(fetchInitData);
}
export default function* ImageStoreSaga() {
  yield fork(initData);
}
