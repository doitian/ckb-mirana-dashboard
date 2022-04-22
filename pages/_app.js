import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CKB Mirana Dashboard</title>
        <meta
          name="description"
          content="CKB Mainnet Hardfork Mirana Countdown and Monitoring."
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
