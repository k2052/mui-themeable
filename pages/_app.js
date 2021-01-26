import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { resetContext } from "kea";
import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";

const SERVER_RENDER_TIMEOUT = 1000;
const makeStore = (initialState, options) => {
  const context = resetContext({ defaults: initialState });
  return context.store;
};

const wrapper = createWrapper(makeStore, { debug: true });

function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(MyApp);
