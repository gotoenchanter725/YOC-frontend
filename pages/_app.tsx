import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import "regenerator-runtime/runtime";

import { wrapper, store } from "../store/store";

import "../src/scss/index.scss";
import LoadingComponent from '../src/components/widgets/LoadingComponent';
import AlertModal from '../src/components/widgets/AlertModal';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
        <Component {...pageProps} />
        <AlertModal />
        <LoadingComponent />
    </Provider>
  )
}

export default wrapper.withRedux(MyApp);
