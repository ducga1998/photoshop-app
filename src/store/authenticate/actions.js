import { createActions } from 'redux-actions';

const authenticateActions = createActions({
  AUTHENTICATE: {
    CHANGE_USER_NAME: null,
    CHANGE_PASSWORD: null,
    LOGIN: null,
    LOGIN_SUCCEEDED: null,
    LOGIN_FAILED: null,
    INIT_DATA: null,
  },
});
export default authenticateActions;
