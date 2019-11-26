import { take,put ,  delay, fork, call } from 'redux-saga/effects';

import cropAction from './actions';

function* doLogin(action) {
    console.log("cadcascasbhjcb",action)
    cropAction.crop.crop( "casbchashbcjhsbbj" )
    yield delay(500);
    yield put(cropAction.crop.crop( "casbchashbcjhsbbj" ));
}

function* loginSaga() {
    while (true) {
        const action = yield take(cropAction.crop.crop);
        console.log("action",action )
        yield call(doLogin, {duc : "casdcascas"});
    }
}

export default function* authenticateSaga() {
    yield fork(loginSaga);
}