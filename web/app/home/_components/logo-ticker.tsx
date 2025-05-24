"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            animate={{ translateX: "-50%" }}
            className="flex flex-none gap-14 pr-14"
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <Image
              alt="Sui"
              className="logo-ticker-image h-7 filter grayscale"
              height={720}
              src={"/brands/sui.png"}
              width={720}
            />
            <Image
              alt="Xellar"
              className="logo-ticker-image h-8 pt-3"
              height={720}
              src={"/brands/xellar.png"}
              width={720}
            />
            <Image
              alt="Wagmi"
              className="logo-ticker-image h-7 pt-1"
              height={720}
              src={"/brands/wagmi.png"}
              width={720}
            />
            <Image
              alt="Ponder"
              className="logo-ticker-image h-9"
              height={720}
              src={"/brands/ponder.png"}
              width={720}
            />

            <Image
              alt="Sui"
              className="logo-ticker-image h-7 filter grayscale"
              height={720}
              src={"/brands/sui.png"}
              width={720}
            />
            <Image
              alt="Xellar"
              className="logo-ticker-image h-8 pt-1"
              height={720}
              src={"/brands/xellar.png"}
              width={720}
            />
            <Image
              alt="Wagmi"
              className="logo-ticker-image h-7 pt-1"
              height={720}
              src={"/brands/wagmi.png"}
              width={720}
            />
            <Image
              alt="Ponder"
              className="logo-ticker-image h-9"
              height={720}
              src={"/brands/ponder.png"}
              width={720}
            />

            <Image
              alt="Sui"
              className="logo-ticker-image h-7 filter grayscale"
              height={720}
              src={"/brands/sui.png"}
              width={720}
            />
            <Image
              alt="Xellar"
              className="logo-ticker-image h-8 pt-1"
              height={720}
              src={"/brands/xellar.png"}
              width={720}
            />
            <Image
              alt="Wagmi"
              className="logo-ticker-image h-7 pt-1"
              height={720}
              src={"/brands/wagmi.png"}
              width={720}
            />
            <Image
              alt="Ponder"
              className="logo-ticker-image h-9"
              height={720}
              src={"/brands/ponder.png"}
              width={720}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
