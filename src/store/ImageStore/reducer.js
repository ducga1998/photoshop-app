import { handleActions } from 'redux-actions';
import arrayMove from 'array-move';
import { List } from 'immutable';
import {
  convertRawDataToStandard,
  getIndexSpreadAndSpreadData,
  swapData,
} from '../../helpers/utils';
import config from '../../config';
import * as uuid from 'uuid';
import ReduxUndo, { excludeAction } from 'redux-undo';

let INITIAL_STATE = {
  initImageState: [],
  selected: [],
  spread: null,
  gallery: [],
};
const imageStoreReduce = handleActions(
  {
    SET_SELECTED: (state, { payload: options }) => {
      // if options === null => selected : []
      // selected has been to object to array
      return { ...state, ...{ selected: options } };
    },
    INIT_DATA: (state, { payload: rawData }) => {
      const standardData = convertRawDataToStandard(rawData);
      return { ...state, ...standardData };
    },
    SWAP_IMG: (state, { payload: { idDrapStart, idDrop } }) => {
      console.log('idDrapStart, idDrop', idDrapStart, idDrop);
      // start get imageSpread
      const listImmutable = List(state.initImageState);
      const { imageSpread, indexPage } = getIndexSpreadAndSpreadData(state);
      const cloneImageSpead = imageSpread.assets.slice();
      const result = swapData(cloneImageSpead, idDrapStart, idDrop);
      const changeArray = listImmutable.setIn([indexPage, 'assets'], result);
      return { ...state, ...{ initImageState: changeArray.toArray() } };
    },
    // change image as use data action  (idElement)
    CHANGE_IMG_DATA: (state, { payload: { data, idDrop } }) => {
      const listImmutable = List(state.initImageState);
      const { imageSpread, indexPage } = getIndexSpreadAndSpreadData(state);
      // check 2 case :
      // TH1 : drop img to gallery ===> add param idDrop object
      // TH2  : use for rotate, flipX,flipY and every data in img , (no add param idDrop, only add data obj )
      const newImageSpead = imageSpread.assets.map(item => {
        if (
          item.idElement === idDrop ||
          (!idDrop &&
            state.selected.some(select => select.idElement === item.idElement))
        ) {
          item = { ...item, ...data };
        }
        return item;
      });
      const changeArray = listImmutable.setIn(
        [indexPage, 'assets'],
        newImageSpead,
      );
      return { ...state, ...{ initImageState: changeArray.toArray() } };
    },
    RE_LAYOUT: (state, { payload: data }) => {
      const listImmutable = List(state.initImageState);
      const { indexPage ,imageSpread} = getIndexSpreadAndSpreadData(state);
      const { assets } = data;
      console.log("imageSpread.assets",imageSpread.assets)
      const datatest = assets.map(asset => {
        const oldData = imageSpread.assets.find(item =>  !item.src.includes(asset.uniqueId) && item.uniqueId === asset.uniqueId )
        console.log("oldData",oldData)
        return {
          ...asset,
          ...{
            src:oldData ? oldData.src :
              config.BASE_URL +
              'u-ojiNLBbWbrP1dkzg2gVXYD/gallery/' +
              asset.uniqueId,
            idElement: uuid(),
          },
        };
      });
      console.log('datatest', datatest);
      const changeArray = listImmutable.setIn([indexPage, 'assets'], datatest);
      return {
        ...state,
        ...{ initImageState: changeArray.toArray(), selected: [] },
      };
    },
    DELETE_IMG: (state, { payload: id }) => {
      const listIdDelete = id
        ? [id]
        : state.selected.map(select => select.idElement);
      const listImmutable = List(state.initImageState);
      const { imageSpread, indexPage } = getIndexSpreadAndSpreadData(state);
      const deletedList = imageSpread.assets.map(item => {
        if (listIdDelete.includes(item.idElement)) {
          item.croprect = {};
          item.src = '';
        }
        return item;
      });
      const changeArray = listImmutable.setIn(
        [indexPage, 'assets'],
        deletedList,
      );
      return { ...state, ...{ initImageState: changeArray.toArray() } };
    },
    CHANGE_SPREAD: (state, { payload: spread }) => {
      return { ...state, ...{ spread } };
    },
    REORDER_SPREAD: (state, { payload }) => {
      const { oldIndex, newIndex } = payload;
      return {
        ...state,
        initImageState: arrayMove(state.initImageState, oldIndex, newIndex),
      };
    },
    REMOVE_SPREAD: (state, { payload }) => {
      const { index } = payload;
      return {
        ...state,
        initImageState: state.initImageState.filter((a, i) => i !== index),
      };
    },
  },
  INITIAL_STATE,
);

export default ReduxUndo(imageStoreReduce, {
  filter: excludeAction(['INIT_DATA', '']),
  limit: 25,
});