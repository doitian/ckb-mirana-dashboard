import Nav from "../components/nav.jsx";
import Countdown from "../components/countdown.jsx";

export default function Home({ menu, tip }) {
  return (
    <>
      <Nav menu={menu} />
      <Countdown tip={tip} />
    </>
  );
}

export function getStaticProps() {
  return {
    props: {
      menu: [
        {
          name: "Nervos",
          href: "https://www.nervos.org/",
        },
        {
          name: "Explorer",
          href: "https://explorer.nervos.org/",
        },
      ],
      tip: {
        targetEpoch: 5414,
        fetchTime: "2022-04-19T08:28:31.260Z",
        epochNumber: 5289,
        epochLength: 1032,
        epochBlockIndex: 693,
        estimatedEpochTime: 14731248,
      },
    },
    revalidate: 10,
  };
}
