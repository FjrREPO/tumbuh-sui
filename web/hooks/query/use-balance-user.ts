import { useEffect, useState, useRef } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";

import { normalize } from "@/lib/bignumber";

export function useBalanceUser(packageId: string) {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const address = account?.address;

  const coinType = `${packageId}::mock_usdc::MOCK_USDC`;

  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const balanceRef = useRef<number | null>(null); // store previous balance without triggering re-renders

  useEffect(() => {
    if (!address) {
      setBalance(null);
      balanceRef.current = null;

      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.getCoins({ owner: address, coinType });
        const total = res.data.reduce(
          (acc, coin) => acc + Number(coin.balance),
          0,
        );

        if (balanceRef.current !== total) {
          balanceRef.current = total;
          setBalance(total);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance(); // initial fetch
    const intervalId = setInterval(fetchBalance, 5000); // polling every 5s

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [address, client, coinType]);

  const normalizedBalance = normalize(balance ?? 0, 6);

  return { balance, normalizedBalance, loading, error };
}
