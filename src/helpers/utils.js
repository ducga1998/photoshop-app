import config from '../config';
import uuid from 'uuid';
import { List } from 'immutable';

export const STATE_DRAGGING = {
  isDragging: false,
  src: '',
  uniqueId: '',
  dragOut: false,
  idDragging: '',
  positionDrop: '',

  clear: () => {
    STATE_DRAGGING.src = '';
    STATE_DRAGGING.uniqueId = '';
    STATE_DRAGGING.dragOut = false;
    STATE_DRAGGING.idDragging = '';
  },
};
export const getIndexSpreadAndSpreadData = state => {
  const imageSpread = state.initImageState.find(
    item => item.idPage === (state.spread || state.initImageState[0].idPage),
  );
  // end get imageSpread
  // get indexPage
  const indexPage = state.initImageState.indexOf(imageSpread);
  return { imageSpread, indexPage, listImmutable: List(state.initImageState) };
};
export const convertRawDataToStandard = rawData => {
  const {
    files: gallery,
    assetPrefix,
    layout: {
      photobook: { pagespreads },
    },
  } = rawData;
  const initImageState = pagespreads.map(item => {
    const { assets: itemAssets, ...other } = item;
    const assets = itemAssets.map(asset => ({
      ...asset,
      ...{
        src: config.BASE_URL + assetPrefix + asset.uniqueId,
        idElement: uuid(),
      },
    }));
    return {
      assets,
      ...other,
      idPage: uuid(),
    };
  });
  return {
    initImageState,
    gallery,
  };
};

export function getFromMaxMin(min, value, max) {
  return min > value ? min : max < value ? max : value;
}

export const URL_API_RELAYOUT =
  'https://t69kla0zpk.execute-api.ap-southeast-1.amazonaws.com/dev/relayout/p-7ubVMK7eak6da3MwH7vz5X/spread/';
