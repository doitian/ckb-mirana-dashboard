import React, { useState, useEffect } from "react";
import ReadyComputingPower from "../components/ready-computing-power.jsx";
import NodesTable from "../components/nodes-table.jsx";

export default function Main({ minerVersions, nodes }) {
  return (
    <div className="shadow-lg rounded-2xl bg-white max-w-screen-xl m-auto p-8 mb-20">
      <ReadyComputingPower minerVersions={minerVersions} />
      <NodesTable nodes={nodes} />
    </div>
  );
}
