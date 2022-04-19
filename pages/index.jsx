import Nav from "../components/nav.jsx";
import Countdown from "../components/countdown.jsx";
import ReadyComputingPower from "../components/ready-computing-power.jsx";
import NodesTable from "../components/nodes-table.jsx";
import { fetchTip } from "./api/tip.js";
import { fetchMinerVersions, fetchNodes } from "./api/data.js";

export default function Home({ menu, targetEpoch, tip, minerVersions, nodes }) {
  return (
    <>
      <Nav menu={menu} />
      <section className="px-2">
        <Countdown targetEpoch={targetEpoch} tip={tip} />

        <div className="shadow-lg rounded-2xl bg-white max-w-screen-xl m-auto p-8 mb-20">
          <ReadyComputingPower minerVersions={minerVersions} />
          <NodesTable nodes={nodes} />
        </div>
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
      minerVersions: await fetchMinerVersions(),
      nodes: await fetchNodes(),
    },
  };
}
