import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Chip } from "@heroui/chip";

import { Vault } from "@/types/api/vault.type";
import { normalizeTVL } from "@/lib/helper";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";

function TestimonialsColumn({
  columnData,
  className,
  duration,
}: {
  columnData: Vault[];
  className?: string;
  duration?: number;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        className="flex flex-col gap-6 pb-6"
        transition={{
          repeat: Infinity,
          duration: duration || 10,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {columnData.map((vault, index) => (
              <div
                key={index}
                className="w-full min-w-[250px] max-w-xs rounded-3xl border border-[#F1F1F1] bg-white p-10 shadow-[0_7px_14px_#EAEAEA]"
              >
                {/* <div className="flex flex-row items-center justify-between">
                  <Chip color="success" variant="flat">
                    {vault.vault_statistics.apy_now.toFixed(2)}%
                  </Chip>
                  <Chip color="success" variant="bordered">
                    {normalizeTVL(
                      vault.vault_statistics.tvl_now,
                      DECIMALS_MOCK_TOKEN,
                    )}
                  </Chip>
                </div> */}
                <div className="flex items-center gap-2">
                  <Image
                    alt={vault.protocol.name}
                    className="rounded-full"
                    height={40}
                    src={vault.protocol.graphics.icon}
                    width={40}
                  />
                  <div className="flex flex-col">
                    <div className="font-medium leading-5 tracking-tight text-black">
                      {vault.protocol.name}
                    </div>
                    <div className="leading-5 tracking-tight text-gray-600">
                      {vault.name}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 mt-5 text-black">
                  <div className="text-md flex justify-between w-full">
                    <span>APY</span>
                    <Chip
                      color={
                        vault.vault_statistics.apy_day_change > 0
                          ? "success"
                          : "danger"
                      }
                      variant="flat"
                    >
                      {vault.vault_statistics.apy_now.toFixed(2)}%
                    </Chip>
                  </div>
                  <div className="text-md flex justify-between w-full">
                    <span>TVL</span>
                    <Chip color="success" variant="flat">
                      {normalizeTVL(
                        vault.vault_statistics.tvl_now,
                        DECIMALS_MOCK_TOKEN,
                      )}
                    </Chip>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export default TestimonialsColumn;
