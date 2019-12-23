import { createActions, createAction } from 'redux-actions';

if (process.browser) {
  window.createAction = createAction;
}
const imageStoreAction = createActions({
  IMAGE: {
    TEST: null,
    SET_SELECTED: null,
    CHANGE_LIST_IMG_DATA: null,
    CHANGE_IMG_DATA: null,
    DELETE_IMG: null,
    CHANGE_SPREAD: null,
    REORDER_SPREAD: null,
    REMOVE_SPREAD: null,
    SWAP_IMG: null,
    INIT_DATA: null,
    RE_LAYOUT: null,
    CHANGE_GALLERY: null,
    SELECT_IMAGE_FROM_GALLERY: null,
  },
});

export default imageStoreAction;
