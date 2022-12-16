import type { AppProps } from 'next/app'
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import { Provider } from "react-redux";
import "regenerator-runtime/runtime";

import { wrapper, store } from "../store/store";

import "../src/scss/index.scss";
import LoadingComponent from '../src/components/widgets/LoadingComponent';
import AlertModal from '../src/components/widgets/AlertModal';

function MyApp({ Component, pageProps }: AppProps) {
  const supportedChainIds = [5, 5];
  
  const connectors = {
    injected: {},
  };

  return (
    <Provider store={store}>
      <ThirdwebWeb3Provider
        supportedChainIds={supportedChainIds}
        connectors={connectors}
      >
        <Component {...pageProps} />
        <AlertModal />
        <LoadingComponent />
      </ThirdwebWeb3Provider>
    </Provider>
  )
}

export default wrapper.withRedux(MyApp);
