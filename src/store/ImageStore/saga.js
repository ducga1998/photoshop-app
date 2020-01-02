import { all, call, delay, fork, put, select, take } from 'redux-saga/effects';

import imageStoreAction from './actions';
import authorizedRequest from '../../helpers/request/authorizedRequest';
import { URL_API_RELAYOUT } from '../../helpers/utils';
import { BASE_URL_REQUEST } from '../../config/config.dev';
import config from '../../config';
import { isClientSide } from '../../helpers/render.helper';
import { toast } from 'react-toastify';
import _ from 'lodash';

export const idProject = 'p-7ubVMK7eak6da3MwH7vz5X';

function spreadDataSelected(state) {
  const { initImageState } = state.imageStore.present;
  return (
    initImageState.find(
      spreadItem => spreadItem.idPage === state.imageStore.present.spread,
    ) || initImageState[0]
  ).assets;
}
function* fetchInitData() {
  yield delay(500);
  const data = yield authorizedRequest.get(BASE_URL_REQUEST + idProject);
  yield put(imageStoreAction.image.initData(data));
}
function* initData() {
  yield call(fetchInitData);
}
function* watchSaveProject() {
  while (true) {
    yield take('SAVE_PROJECT');
    const rawData = yield select(state =>
      state.imageStore.present.initImageState.map((imgState, index) => {
        return {
          assets: imgState.assets.map(item => {
            return _.pick(item, [
              'aoirect',
              'croprect',
              'layouthint',
              'pixelheight',
              'pixelwidth',
              'targetrect',
              'uniqueId',
            ]);
          }),
          pagespreadIndex: index,
          leftLayoutIndex: 0,
          rightLayoutIndex: 0,
        };
      }),
    );
    const rawDataSendServer = {
      photobook: {
        coverid: '20171212_145352.jpg',
        pagespreads: rawData,
      },
    };
    const respond = yield authorizedRequest.put(
      config.BASE_URL_REQUEST + idProject,
      {
        layout: rawDataSendServer,
      },
    );
    if (respond.layout) {
      if (isClientSide()) {
        localStorage.setItem('pwa-store', '');
      }
      toast.success('Save Success');
    } else {
      toast.error('Save False');
    }
  }
}
function* watchDeleteImage() {
  while (true) {
    const { id } = yield take('DELETE_IMG_ASYNC');
    yield put(imageStoreAction.image.deleteImg(id ? [id] : undefined));
    const assetsSelected = yield select(spreadDataSelected);
    const dataBeforeDelete = {
      assets: assetsSelected,
      leftLayoutIndex: 0,
      pagespreadIndex: 1,
      rightLayoutIndex: 0,
    };
    const dataBeforeRelayout = yield authorizedRequest.put(
      URL_API_RELAYOUT + 'left',
      dataBeforeDelete,
    );
    yield put(imageStoreAction.image.reLayout(dataBeforeRelayout));
  }
}

function* doRelayout(assets, positionDrop) {
  try {
    const result = yield call(
      authorizedRequest.put,
      URL_API_RELAYOUT + positionDrop,
      assets,
    );

    console.log(result);
    if (result && Object.keys(result).length === 0) {
      toast.error('Maximum in layout');
      return;
    }
    yield put(
      imageStoreAction.image.reLayout({ ...result, ...{ positionDrop } }),
    );
  } catch (e) {
    console.log(e);
    toast('Đã có lỗi');
  }
}

function* watchRelayout() {
  while (true) {
    const { assets, positionDrop } = yield take('FETCH_DATA_RELAYOUT');
    yield call(doRelayout, assets, positionDrop);
  }
}

export default function* ImageStoreSaga() {
  yield all([
    fork(initData),
    fork(watchRelayout),
    fork(watchDeleteImage),
    fork(watchSaveProject),
  ]);
}
