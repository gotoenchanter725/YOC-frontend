import { useMemo } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import "regenerator-runtime/runtime";

import { wrapper, store } from "../store/store";
import WalletWagmiProvider from 'src/providers/WagmiProvider';

import "../src/scss/index.scss";
import LoadingComponent from '@components/widgets/LoadingComponent';
import AlertModal from '@components/widgets/AlertModal';
import defaultLayout from '@layouts/defaultLayout';
import adminLayout from '@layouts/adminLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const Layout = useMemo(() => {
    if (router.pathname.indexOf('/admin') == -1) return defaultLayout;
    else return adminLayout;
  }, [router.pathname])

  return (
    <Provider store={store}>
      <WalletWagmiProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <AlertModal />
        <LoadingComponent />
      </WalletWagmiProvider>
    </Provider>
  )
}

export default wrapper.withRedux(MyApp);
