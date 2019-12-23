import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { configStore } from '../store';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    if (process.browser) {
      window['storeRedux'] = store;
    }
    return (
      <Fragment>
        <Head>
          <title>PWA Photo Book</title>
        </Head>
        <Provider store={store}>
          <ToastContainer />
          <Component {...pageProps} />
        </Provider>
      </Fragment>
    );
  }
}

export default withRedux(configStore)(MyApp);
