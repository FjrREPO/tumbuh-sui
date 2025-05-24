"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={sectionRef} className="overflow-x-clip pb-24">
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Why choose {siteConfig.name}?</h2>
          <p className="section-description mt-5">
            Easy earn.
            <br />
            Agent makes it automatic,
            <br />
            {siteConfig.name} makes profit.
          </p>
          <motion.img
            alt="Star Image"
            className="absolute -left-[350px] -top-[137px]"
            src="/assets/star.png"
            style={{ translateY }}
            width={360}
          />
          <motion.img
            alt="Spring Image"
            className="absolute -right-[331px] -top-[19px]"
            src={"/assets/spring.png"}
            style={{ translateY }}
            width={360}
          />
        </div>
        <div className="mt-10 flex justify-center gap-2">
          <Link href={"/earn"}>
            <button className="btn btn-primary">Try App </button>
          </Link>
          <button className="btn btn-text gap-1">
            <span>Learn more</span>{" "}
            <Image
              alt="arrow-icon"
              className="h-5 w-5"
              height={720}
              src="/assets/arrow-right.svg"
              width={720}
            />
          </button>
        </div>
      </div>
    </section>
  );
};
