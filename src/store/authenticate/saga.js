import { call, delay, fork, put, take } from 'redux-saga/effects';

import authenticateActions from './actions';

function* doLogin(action) {
  yield delay(500);
  yield put(
    authenticateActions.authenticate.loginSucceeded({ hello: 'world' }),
  );
}

function* loginSaga() {
  while (true) {
    const action = yield take(authenticateActions.authenticate.login);
    yield call(doLogin, action);
  }
}

export default function* authenticateSaga() {
  yield fork(loginSaga);
}
