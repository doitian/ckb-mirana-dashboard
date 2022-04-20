import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SWRComponent({
  api,
  swrOptions,
  component,
}) {
  const { data, error } = useSWR(api, fetcher, swrOptions);
  return component(data || swrOptions.fallbackData);
}
