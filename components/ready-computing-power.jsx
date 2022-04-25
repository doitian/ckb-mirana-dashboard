import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);

function formatTimeAxis(time) {
  return `${time.getMonth() + 1}/${time.getDate()} ${time
    .getHours()
    .toString()
    .padStart(2, "0")}:00`;
}

function LineChart({ className, minerVersions }) {
  const labels = minerVersions.map((e) => formatTimeAxis(new Date(e.time)));
  const points = minerVersions.map(
    (e) => Math.floor((e.ready / e.total) * 10000) / 100
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Ready (%)",
        data: points,
        borderColor: "rgba(0, 204, 155, 1)",
        backgroundColor: "rgba(0, 204, 155, 0.5)",
      },
    ],
  };

  const options = {
    scales: {
      yAxis: {
        max: 100,
        ticks: {
          callback: (v) => `${v}%`,
        },
      },
      xAxis: {
        ticks: {
          callback: (i) => {
            const label = labels[i];
            const majorTime = i % 2 === 0 ? "00:00" : "04:00";
            return label.endsWith(majorTime) ? label.split(" ")[0] : "";
          },
        },
      },
    },
  };

  return (
    <div className={className}>
      <h3 className="text-lg text-center">Last 7 Days</h3>
      <Line data={data} options={options} />
    </div>
  );
}

function PieChart({ className, minerVersions }) {
  const sum = { ready: 0, total: 0 };
  for (const entry of minerVersions.slice(-2)) {
    sum.ready += entry.ready;
    sum.total += entry.total;
  }

  const readyPercent = Math.floor((sum.ready / sum.total) * 10000) / 100;
  const unreadyPercent = Math.floor((100 - readyPercent) * 100) / 100;

  const data = {
    labels: [`Ready (${readyPercent}%)`, `Not Ready (${unreadyPercent}%)`],
    datasets: [
      {
        label: "# of Mined Blocks",
        data: [sum.ready, sum.total - sum.ready],
        backgroundColor: ["rgba(0, 204, 155, 1)", "rgba(255, 94, 94, 1)"],
      },
    ],
  };

  return (
    <div className={className}>
      <h3 className="text-lg text-center mb-1">Last 4 Hours</h3>
      <Pie data={data} />
    </div>
  );
}

export default function ReadyComputingPower(props) {
  return (
    <div className="mb-20">
      <h2 className="basis-full text-xl font-medium text-center">
        Computing Power
      </h2>
      <p className="text-center text-slate-400"># of Mined Blocks</p>
      <div className="grid grid-cols-4">
        <PieChart className="col-span-4 sm:col-span-1" {...props} />
        <LineChart className="col-span-4 sm:col-span-3" {...props} />
      </div>
    </div>
  );
}
