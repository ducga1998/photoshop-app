import { handleActions } from 'redux-actions';

const INITIAL_STATE = {
  username: '',
  password: '',
  loggingIn: false,
  initData: null,
};

const authenticateReducer = handleActions(
  {
    AUTHENTICATE: {
      CHANGE_USER_NAME: (state, action) => {
        return {
          ...state,
          username: action.payload,
        };
      },
      INIT_DATA: (state, action) => {
        return {
          ...state,
        };
      },
      CHANGE_PASSWORD: (state, action) => {
        return {
          ...state,
          password: action.payload,
        };
      },
      LOGIN: state => {
        return {
          ...state,
          loggingIn: true,
        };
      },
      LOGIN_SUCCEEDED: state => {
        return {
          ...state,
          loggingIn: false,
        };
      },
      LOGIN_FAILED: state => {
        return {
          ...state,
          loggingIn: false,
        };
      },
    },
  },
  INITIAL_STATE,
);
export default authenticateReducer;
