// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (process && process.env.NODE_ENV == "development") {
    return res.status(200).json({
      fetch_time: "2022-04-19T03:16:38.720Z",
      epoch_number: 5288,
      epoch_length: 1173,
      epoch_block_index: 241,
      estimated_epoch_time: 14731248,
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
      fetch_time: new Date().toISOString(),
      epoch_number: parseInt(epoch_info.epoch_number, 10),
      epoch_length: parseInt(epoch_info.epoch_length, 10),
      epoch_block_index: parseInt(epoch_info.index, 10),
      estimated_epoch_time: parseInt(stat.data.estimated_epoch_time, 10),
    });
  } else {
    res.status(statRes.status).send(statRes.body);
  }
}
