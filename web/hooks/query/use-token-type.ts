import { useEffect, useState } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";

import { addressTumbuh } from "@/lib/constants";

type CoinStruct = {
  coinType: string;
  balance: string;
  coinObjectId: string;
};

const MOCK_USDC_TYPE = `${addressTumbuh}::mock_usdc::MOCK_USDC`;

export function useTokenType() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const address = account?.address;
  const [data, setData] = useState<CoinStruct[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    client
      .getCoins({
        owner: address,
        coinType: MOCK_USDC_TYPE,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        setError(e as Error);
      });

    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, [address, client]);

  return { data };
}
