import { createActions, createAction } from 'redux-actions';
// const increament =  createActions)
// window.createAction = createAction
if (process.browser) {
    // window['storeRedux']  = store
    window.createAction = createAction
}
const imageCropAction  = createActions({
    CROP: {
      CROP : null
    },
    TEST : null,
    SELECTED : null,
    CHANGEIMG : null
})
export default imageCropAction;
