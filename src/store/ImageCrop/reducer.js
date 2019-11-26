import { handleActions } from 'redux-actions';
import { dataView } from '../../components/images/dataView';
import uuid from 'uuid';
import {List} from 'immutable'
const INITIAL_STATE = {
  initImageState: dataView.map(item => ({ ...item, ...{ idPage: uuid() } })),
  selected: {},
};
const imageCropReduce = handleActions(
  {
    SELECTED: (state, action) => {
      const { payload: options } = action;
      return { ...state, ...{ selected: options } };
    },
    CHANGEIMG: (state, action) => {
      // const { initImageState } = state
      // const { selected: { id } } = this.state
      // const listData = List(initImageState)
      // const newData = listData.get(9).assets.map(item => {
      //   if (item.uniqueId === id) {
      //     console.log("{ ...item, ...action.payload }",{ ...item, ...action.payload })
      //     return { ...item, ...action.payload }
      //   }
      //   return item
      // });

      return state
    },
    INITIAL_STATE,
  }
);

export default imageCropReduce;
