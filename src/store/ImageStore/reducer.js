import { handleActions } from 'redux-actions';
import arrayMove from 'array-move';
import { List } from 'immutable';
import {
  convertRawDataToStandard,
  getIndexSpreadAndSpreadData,
} from '../../helpers/utils';
import config from '../../config';
import * as uuid from 'uuid';
import _omit from 'lodash/omit';
import imageStoreAction from './actions';
import { undoable } from '../../helpers/undoable';

let INITIAL_STATE = {
  initImageState: [],
  selected: [],
  spread: null,
  gallery: [],
  gallerySelected: [],
};
const imageStoreReduce = handleActions(
  {
    IMAGE: {
      SET_SELECTED: (state, { payload: options }) => {
        // if options === null => selected : []
        // selected has been to object to array
        return { ...state, ...{ selected: options } };
      },
      INIT_DATA: (state, { payload: rawData }) => {
        let standardData;
        const { initImageState, gallery } = convertRawDataToStandard(rawData);
        if (process.browser) {
          const storecache = localStorage.getItem('pwa-store');
          if (!storecache || (storecache && storecache.length === 0)) {
            standardData = { initImageState, gallery };
          } else {
            standardData = { ...JSON.parse(storecache), ...{ gallery } };
          }
        }
        return { ...state, ...standardData };
      },
      SWAP_IMG: (state, { payload: { idDrapStart, idDrop } }) => {
        const listImmutable = List(state.initImageState);
        const { indexPage } = getIndexSpreadAndSpreadData(state);
        const imageSpread = listImmutable.getIn([indexPage, 'assets']);
        const indexDrag = imageSpread.findIndex(
          i => i.idElement === idDrapStart,
        );
        const indexDrop = imageSpread.findIndex(i => i.idElement === idDrop);
        const drag = listImmutable.getIn([indexPage, 'assets', indexDrag]);
        const drop = listImmutable.getIn([indexPage, 'assets', indexDrop]);
        const listSwapKey = [
          'croprect',
          'src',
          'rotate',
          'flipHorizontal',
          'flipVertical',
          'filterColor',
        ];
        const changeArray = listSwapKey.reduce((acc, key) => {
          return acc
            .setIn([indexPage, 'assets', indexDrag, key], drop[key])
            .setIn([indexPage, 'assets', indexDrop, key], drag[key]);
        }, listImmutable);
        return { ...state, ...{ initImageState: changeArray.toArray() } };
      },
      CHANGE_LIST_IMG_DATA: (state, { payload: listDataChange }) => {
        const {
          imageSpread,
          indexPage,
          listImmutable,
        } = getIndexSpreadAndSpreadData(state);
        const newImageSpead = imageSpread.assets.map(item => {
          // check array
          const listChange = listDataChange.find(
            itemDataChange => itemDataChange.idElement === item.idElement,
          );
          if (listChange) {
            return { ...item, ..._omit(listChange, 'idElement') };
          }
          return item;
        });
        const changeArray = listImmutable.setIn(
          [indexPage, 'assets'],
          newImageSpead,
        );
        return { ...state, ...{ initImageState: changeArray.toArray() } };
      },
      // change image as use data action  (idElement)
      CHANGE_IMG_DATA: (state, { payload: { data, idDrop } }) => {
        const listImmutable = List(state.initImageState);
        const { imageSpread, indexPage } = getIndexSpreadAndSpreadData(state);
        // check 2 case :
        // TH1 : drop img to gallery ===> add param idDrop object
        // TH2  : use for rotate, ,flipVertical and every data in img , (no add param idDrop, only add data obj )
        const newImageSpead = imageSpread.assets.map(item => {
          if (
            item.idElement === idDrop ||
            (!idDrop &&
              state.selected.some(
                select => select.idElement === item.idElement,
              ))
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
      CHANGE_GALLERY: (state, { payload: gallery }) => {
        return { ...state, ...{ gallery } };
      },
      RE_LAYOUT: (state, { payload: data }) => {
        const listImmutable = List(state.initImageState);
        const { indexPage } = getIndexSpreadAndSpreadData(state);
        const { assets } = data;

        const newSpead = assets.map(newAsset => {
          // uniqueId is id pic in server
          // map data old =>
          //2 => 3
          // console.log('newAsset',newAsset)
          return {
            ...newAsset,
            ...{
              src:
                config.BASE_URL +
                'u-q7gj6ScmFeiCH4sYGqEY4A/gallery/' +
                newAsset.uniqueId,
              idElement: uuid(),
            },
          };
        });
        const newIdPage = uuid();
        let currentSpread = state.spread;
        if (currentSpread === listImmutable.getIn([indexPage, 'idPage'])) {
          currentSpread = newIdPage;
        }
        const changeArray = listImmutable
          .setIn([indexPage, 'assets'], newSpead)
          .setIn([indexPage, 'idPage'], newIdPage);
        localStorage.setItem(
          'pwa-store',
          JSON.stringify({
            initImageState: changeArray.toArray(),
          }),
        );
        return {
          ...state,
          ...{ initImageState: changeArray.toArray(), selected: [] },
          spread: currentSpread,
        };
      },
      DELETE_IMG: state => {
        const listIdDelete = state.selected.map(select => select.idElement);
        const listImmutable = List(state.initImageState);
        const { imageSpread, indexPage } = getIndexSpreadAndSpreadData(state);
        const deletedList = imageSpread.assets.filter(
          item => !listIdDelete.includes(item.idElement),
        );
        const changeArray = listImmutable.setIn(
          [indexPage, 'assets'],
          deletedList,
        );
        return { ...state, ...{ initImageState: changeArray.toArray() } };
      },
      CHANGE_SPREAD: (state, { payload: spread }) => {
        return { ...state, ...{ spread, selected: [] } };
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
        const isCurrentSpread =
          state.initImageState[index].idPage === state.spread;
        console.log(isCurrentSpread);
        const newBook = state.initImageState.filter((a, i) => i !== index);
        console.log(newBook[index]);
        return {
          ...state,
          initImageState: newBook,
          spread: isCurrentSpread ? newBook[index].idPage : state.spread,
          selected: [],
        };
      },
      SELECT_IMAGE_FROM_GALLERY: (state, { payload }) => {
        return {
          ...state,
          gallerySelected: payload || [],
        };
      },
    },
  },
  INITIAL_STATE,
);

export default undoable(imageStoreReduce, {
  actionExclude: [
    String(imageStoreAction.image.setSelected),
    String(imageStoreAction.image.changeSpread),
    String(imageStoreAction.image.deleteImg),
    String(imageStoreAction.image.selectImageFromGallery),
  ],
  initAction: String(imageStoreAction.image.initData),
  limit: 100,
  useDiff: true,
});
