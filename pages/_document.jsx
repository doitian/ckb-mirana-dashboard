import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>CKB Mirana Dashboard</title>
        <meta
          name="description"
          content="CKB Mainnet Hardfork Mirana Countdown and Monitoring."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
