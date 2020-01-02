import { createActions } from 'redux-actions';

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
    CHANGE_VIEW_MOBILE: null,
    TOGGLE_ACTIVE_SPREAD: null,
    FETCH_DATA_RELAYOUT: null,
    ADD_NEW_SPREAD: null,
  },
});
export default imageStoreAction;
