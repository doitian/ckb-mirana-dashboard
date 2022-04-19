import Nav from "../components/nav.jsx";
import Countdown from "../components/countdown.jsx";
import ReadyComputingPower from "../components/ready-computing-power.jsx";
import NodesTable from "../components/nodes-table.jsx";
import StatusMap from "../components/status-map.jsx";
import FAQ from "../components/faq.jsx";
import { fetchTip } from "./api/tip.js";
import { fetchMinerVersions, fetchNodes } from "./api/data.js";

export default function Home({
  menu,
  targetEpoch,
  tip,
  minerVersions,
  nodes,
  statusMap,
}) {
  return (
    <>
      <Nav menu={menu} />
      <section className="px-2">
        <Countdown targetEpoch={targetEpoch} tip={tip} />

        <div className="shadow-lg rounded-2xl bg-white max-w-screen-xl m-auto p-8 mb-20">
          <ReadyComputingPower minerVersions={minerVersions} />
          <NodesTable nodes={nodes} />
        </div>

        <div className="max-w-screen-xl m-auto mb-20 grid grid-cols-2 gap-0 sm:gap-8 md:gap-16">
          <StatusMap statusMap={statusMap} />
          <FAQ />
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
          name: "Announcement",
          href: "https://www.nervos.org/blog/nervos-layer-1-a-major-protocol-upgrade-is-rolling-out",
        },
        {
          name: "Explorer",
          href: "https://explorer.nervos.org/",
        },
      ],
      targetEpoch: 5414,

      statusMap: [
        {
          title: "Exchanges",
          header: "Exchange",
          data: [
            { name: "Foo", status: "Ready" },
            { name: "Bar", status: "No Information" },
            { name: "Zoo", status: "Not Ready" },
          ],
        },
        {
          title: "Infrastructure Providers",
          header: "Exchange",
          data: [
            { name: "Explorer", status: "Ready" },
            { name: "Foo", status: "Ready" },
            { name: "Bar", status: "No Information" },
            { name: "Zoo", status: "Not Ready" },
          ],
        },
        {
          title: "Miners",
          header: "Miner",
          data: [
            { name: "Foo", status: "Ready" },
            { name: "Bar", status: "No Information" },
            { name: "Zoo", status: "Not Ready" },
          ],
        },
      ],

      tip: await fetchTip(),
      minerVersions: await fetchMinerVersions(),
      nodes: await fetchNodes(),
    },
  };
}
