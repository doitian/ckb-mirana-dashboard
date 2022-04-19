// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function fetchTip() {
  if (process && process.env.NODE_ENV == "development") {
    return {
      fetchTime: "2022-04-19T08:28:31.260Z",
      epochNumber: 5289,
      epochLength: 1032,
      epochBlockIndex: 693,
      estimatedEpochTime: 14731248,
    };
  }

  const statRes = await fetch(
    "https://api.explorer.nervos.org/api/v1/statistics",
    {
      headers: {
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
      },
    }
  );

  if (statRes.ok) {
    const stat = await statRes.json();
    const epoch_info = stat.data.attributes.epoch_info;
    return {
      fetchTime: new Date().toISOString(),
      epochNumber: parseInt(epoch_info.epoch_number, 10),
      epochLength: parseInt(epoch_info.epoch_length, 10),
      epochBlockIndex: parseInt(epoch_info.index, 10),
      estimatedEpochTime: parseInt(stat.data.estimated_epoch_time, 10),
    };
  }

  throw new Exception(`${statRes.status}: ${await statRes.text()}`);
}

export default async function handler(req, res) {
  const tip = await fetchTip();

  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
  res.status(200).json(tip);
}
