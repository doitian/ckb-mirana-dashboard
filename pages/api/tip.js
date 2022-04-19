// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const statRes = await fetch(
    "https://api.explorer.nervos.org/api/v1/statistics",
    {
      headers: {
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
      },
    }
  );

  if (!statRes.ok) {
    res.status(statRes.status).send(statRes.body);
  } else {
    const stat = await statRes.json();
    const epoch_info = stat.data.attributes.epoch_info;
    res.setHeader("Cache-Control", "s-maxage=600");
    res.status(200).json({
      fetch_time: new Date().toISOString(),
      epoch_number: parseInt(epoch_info.epoch_number),
      epoch_length: parseInt(epoch_info.epoch_length),
      epoch_block_index: parseInt(epoch_info.index),
    });
  }
}
