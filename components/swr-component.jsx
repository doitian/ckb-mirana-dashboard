import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SWRComponent({
  api,
  fallbackData,
  refreshInterval,
  component,
}) {
  const { data, error } = useSWR(api, fetcher, {
    fallbackData,
    refreshInterval,
  });
  return component(data || fallbackData);
}
