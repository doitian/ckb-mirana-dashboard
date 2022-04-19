const NAME_OF_NODE = {
  "4核8G加利福尼亚州": "California",
  "texas-azure": "Texas",
  "8核16G弗吉尼亚": "Virginia",
  "toronto-azure": "Toronto",
  "victoria-azure": "Victoria",
  "4核8G伦敦": "London",
  paris: "Paris",
  "8核16G法兰克福": "Frankfurt",
  "warsaw-ggcloud": "Warsaw",
  "4核8G北京": "Beijing",
  "4核8G香港": "Hongkong",
  "tokyo-azure": "Tokyo",
  "seoul-ggcloud": "Seoul",
  "4核8G新加坡": "Singapore",
  "santiago-ggcloud": "Santiago",
  "4核8G圣保罗": "São Paulo",
  "4核8G悉尼": "Sydney",
  新加坡aarch64: "Aarch64",
};

const ENDPOINT = process.env.P_ENDPOINT;
const QUERY_NODES =
  'count by (last_block_hash, last_blocknumber, node_location) (last_over_time(Node_Get_LastBlockInfo{job="ckb", NodePort="8124"}[5m]))';
const QUERY_MINER_VERSIONS =
  'count_over_time(Node_Get_client_version{job="ckb", NodePort="8124",NodeIP="47.110.15.57"}[4h])';

function basicAuth() {
  return Buffer.from(
    `${process.env.P_USERNAME}:${process.env.P_PASSWORD}`
  ).toString("base64");
}

function isVersionReady(version) {
  const parts = version.split(".");
  if (parts.length == 3) {
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);

    // minimum 0.103.0
    return !isNaN(major) && !isNaN(minor) && (major > 0 || minor >= 103);
  }

  return false;
}

export async function fetchNodes() {
  const params = new URLSearchParams({
    query: QUERY_NODES,
  });
  const resp = await fetch(`${ENDPOINT}/query?${params}`, {
    headers: {
      authorization: `Basic ${basicAuth()}`,
    },
  });

  const respData = await resp.json();
  if (respData.status == "error") {
    throw new Exception(`${respData.errorType}: ${respData.error}`);
  }

  const lastNumber = Math.max(
    ...respData.data.result.map((e) => parseInt(e.metric.last_blocknumber, 10))
  );

  const nodesMap = new Map();
  for (const entry of respData.data.result) {
    const metric = entry.metric;
    const nodeName = NAME_OF_NODE[metric.node_location];
    const index = lastNumber - parseInt(metric.last_blocknumber, 10);
    if (index > 4) {
      // only last 5 blocks
      continue;
    }

    if (nodeName !== undefined) {
      if (!nodesMap.has(nodeName)) {
        nodesMap.set(nodeName, []);
      }
      nodesMap.get(nodeName)[index] = metric.last_block_hash.substr(2, 5);
    }
  }

  const nodes = Array.from(nodesMap, ([name, blocks]) => ({
    name,
    blocks,
  })).sort((a, b) => {
    a.name < b.name ? -1 : 1;
  });

  return {
    lastNumber,
    nodes,
  };
}

export async function fetchMinerVersions() {
  const now = new Date();
  const nowTimestamp = +now;
  // Round to 4 hours
  const roundedNowTimestamp = Math.floor(nowTimestamp / 14400000) * 14400000;
  // Use rounded timestamp when the last bucket length is less than 3 minutes
  const endDate =
    nowTimestamp - roundedNowTimestamp < 180
      ? new Date(roundedNowTimestamp)
      : now;
  // 7 days
  const startDate = new Date(roundedNowTimestamp - 604800000);

  const params = new URLSearchParams({
    query: QUERY_MINER_VERSIONS,
    step: "4h",
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  });

  const resp = await fetch(`${ENDPOINT}/query_range?${params}`, {
    headers: {
      authorization: `Basic ${basicAuth()}`,
    },
  });
  const respData = await resp.json();

  if (respData.status == "error") {
    throw new Exception(`${respData.errorType}: ${respData.error}`);
  }
  const offset = respData.data.result[0].values[0][0];

  const history = [];
  for (const entry of respData.data.result) {
    const isReady = isVersionReady(entry.metric.client_version);
    for (const v of entry.values) {
      const index = (v[0] - offset) / 14400;
      const count = parseInt(v[1], 10);
      if (index < 0) {
        continue;
      }
      if (history[index] === undefined) {
        history[index] = {
          time: new Date(v[0] * 1000).toISOString(),
          ready: 0,
          total: 0,
        };
      }
      history[index].total += count;
      if (isReady) {
        history[index].ready += count;
      }
    }
  }

  return history;
}

// P_ENDPOINT: prometheus URL ending with /api/v1
// P_USERNAME: prometheus username
// P_PASSWORD: prometheus password
export default async function handler(req, res) {
  const nodes = await fetchNodes();
  const minerVersions = await fetchMinerVersions();

  res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=60");
  res.status(200).json({ nodes, minerVersions });
}
