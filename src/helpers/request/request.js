import config from '../../config';
import axios from 'axios';
import { mapData, mapError } from './mapData';
export const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUm9sZSI6InVzZXIiLCJ1c2VyRW1haWwiOiJ0ZXN0QHBob3RvYm9vay5haSIsInVzZXJOYW1lIjoiVGVzdCIsImNyZWF0ZWRBdCI6MTU3MjMyMDIxMDE3OCwicGhvbmVWZXJpZmllZCI6ZmFsc2UsImFzcGVjdCI6InVzZXIiLCJpZCI6InUtcTdnajZTY21GZWlDSDRzWUdxRVk0QSIsInZlcmlmaWVkIjpmYWxzZSwiZXhwIjoxNTc1NjA3NjMyMzEyLCJpYXQiOjE1NzU1MjEyMzIsImF1ZCI6IndlYiJ9.wUdEBNjuUVXTbJCXZWCrHkN6MEmGU3HdTpDU8KRKDA8';

const CancelToken = axios.CancelToken;

export default class Request {
  constructor() {
    this.api = axios.create({
      baseURL: config.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setToken(token);
  }

  setToken(token) {
    this.api.defaults.headers.common.Authorization = token
      ? `Bearer ${token}`
      : '';
  }

  get(url, config = {}) {
    let cancel;
    const apiConfig = {
      params: {
        ...config.params,
      },
      ...config,
      cancelToken: new CancelToken(c => (cancel = c)),
    };
    const request = this.api
      .get(url, apiConfig)
      .then(mapData)
      .catch(mapError);
    request.cancel = () => cancel();
    return request;
  }

  post(url, body, config = {}) {
    let cancel;
    const apiConfig = {
      params: {
        ...config.params,
      },
      ...config,
      cancelToken: new CancelToken(c => (cancel = c)),
    };
    const request = this.api
      .post(url, body, apiConfig)
      .then(mapData)
      .catch(mapError);
    request.cancel = () => cancel();
    return request;
  }

  put(url, body, config = {}) {
    let cancel;
    const apiConfig = {
      params: {
        ...config.params,
      },
      ...config,
      cancelToken: new CancelToken(c => (cancel = c)),
    };
    const request = this.api
      .put(url, body, apiConfig)
      .then(mapData)
      .catch(mapError);
    request.cancel = () => cancel();
    return request;
  }

  patch(url, body, config = {}) {
    let cancel;
    const apiConfig = {
      params: {
        ...config.params,
      },
      ...config,
      cancelToken: new CancelToken(c => (cancel = c)),
    };
    const request = this.api
      .patch(url, body, apiConfig)
      .then(mapData)
      .catch(mapError);
    request.cancel = () => cancel();
    return request;
  }

  delete(url, config = {}) {
    let cancel;
    const apiConfig = {
      params: {
        ...config.params,
      },
      ...config,
      cancelToken: new CancelToken(c => (cancel = c)),
    };
    const request = this.api
      .delete(url, apiConfig)
      .then(mapData)
      .catch(mapError);
    request.cancel = () => cancel();
    return request;
  }
}
