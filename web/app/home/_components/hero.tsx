"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@heroui/button";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="pb-20 pt-8 md:overflow-x-clip md:pb-10 md:pt-5 h-full w-full"
    >
      <div className="container">
        <div className="md:flex md:items-center">
          <div className="md:w-[478px]">
            <h1 className="md:tex-7xl mt-6 text-5xl font-bold tracking-tighter">
              {siteConfig.name}
            </h1>
            <p className="mt-6 text-xl tracking-tight">
              {siteConfig.description}
            </p>
            <div className="mt-[30px] flex items-center gap-1">
              <Link href={"/earn"}>
                <Button color="warning" variant="solid">
                  Try App
                </Button>
              </Link>
              <Button variant="light">Learn More</Button>
            </div>
          </div>
          <div className="mt-20 md:relative md:mt-0 md:h-[648px] md:flex-1">
            <motion.img
              alt="Cog Image"
              animate={{
                translateY: [-30, 30],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 3,
                  ease: "easeInOut",
                },
              }}
              className="md:absolute md:-left-6 md:h-full md:w-auto md:max-w-none lg:left-0"
              draggable={false}
              src={
                "https://i.pinimg.com/originals/39/19/d0/3919d053dae9453ab919ae44c605318d.gif"
              }
            />
            <motion.img
              alt="Cylinder Image"
              className="hidden md:absolute md:-left-32 md:-top-8 md:block"
              height={220}
              src={"/assets/cylinder.png"}
              style={{ translateY }}
              width={220}
            />
            <motion.img
              alt="Noodle Image"
              className="hidden lg:absolute lg:left-[448px] lg:top-[524px] lg:block lg:rotate-[30deg]"
              src={"/assets/noodle.png"}
              style={{ translateY, rotate: 30 }}
              width={220}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
