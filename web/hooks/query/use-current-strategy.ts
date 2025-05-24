import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";

type CurrentStrategy = {
  targetToken: string;
  protocol: string;
  allocation: number;
  expectedYield: number;
  active: boolean;
  deployedAmount: string;
  deploymentTime: number;
  lastHarvestTime: number;
  harvestedYield: string;
};

function formatCurrentStrategy(raw: any): CurrentStrategy {
  return {
    targetToken: raw.target_token,
    protocol: raw.protocol,
    allocation: Number(raw.allocation),
    expectedYield: Number(raw.expected_yield),
    active: Boolean(raw.active),
    deployedAmount: raw.deployed_amount,
    deploymentTime: Number(raw.deployment_time),
    lastHarvestTime: Number(raw.last_harvest_time),
    harvestedYield: raw.harvested_yield,
  };
}

export function useCurrentStrategy({ objectId }: { objectId: string }) {
  const client = useSuiClient();
  const [data, setData] = useState<CurrentStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!objectId) return;

    setLoading(true);
    setError(null);

    client
      .getObject({
        id: objectId,
        options: { showContent: true },
      })
      .then((res) => {
        const fields = (res.data?.content as any)?.fields;

        if (fields) {
          const formatted = formatCurrentStrategy(fields);

          setData(formatted);
        } else {
          setData(null);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch object");
      })
      .finally(() => setLoading(false));
  }, [objectId, client]);

  return { data, loading, error };
}
