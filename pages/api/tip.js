// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (process && process.env.NODE_ENV == "development") {
    return res.status(200).json({
      targetEpoch: 5414,
      fetchTime: "2022-04-19T03:16:38.720Z",
      epochNumber: 5288,
      epochLength: 1173,
      epochBlockIndex: 241,
      estimatedEpochTime: 14731248,
    });
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
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    res.status(200).json({
      targetEpoch: 5414,
      fetchTime: new Date().toISOString(),
      epochNumber: parseInt(epoch_info.epoch_number, 10),
      epochLength: parseInt(epoch_info.epoch_length, 10),
      epochBlockIndex: parseInt(epoch_info.index, 10),
      estimatedEpochTime: parseInt(stat.data.estimated_epoch_time, 10),
    });
  } else {
    res.status(statRes.status).send(statRes.body);
  }
}
