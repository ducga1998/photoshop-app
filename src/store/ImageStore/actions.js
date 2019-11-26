import { createActions, createAction } from 'redux-actions';
if (process.browser) {
  window.createAction = createAction;
}
const imageStoreAction = createActions({
  TEST: null,
  SET_SELECTED: null,
  CHANGE_IMG_DATA: null,
  DELETE_IMG: null,
  REORDER_SPREAD: null,
  REMOVE_SPREAD: null,
  SWAP_IMG: null,
  INIT_DATA: null,
  RE_LAYOUT: null,
});
export default imageStoreAction;
