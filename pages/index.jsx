import Nav from "../components/nav.jsx";
import Countdown from "../components/countdown.jsx";
import { fetchTip } from "./api/tip.js";

export default function Home({ menu, targetEpoch, tip }) {
  return (
    <>
      <Nav menu={menu} />
      <section className="px-2">
        <Countdown targetEpoch={targetEpoch} tip={tip} />
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
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
      targetEpoch: 5414,
      tip: await fetchTip(),
    },
  };
}
