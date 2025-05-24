"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={sectionRef} className="overflow-x-clip py-24">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Boost productivity</div>
          </div>
          <h2 className="section-title mt-5">
            A more effective way to earn easily
          </h2>
          <p className="section-description mt-5">
            Our platform is designed to help you maximize your earnings with
            minimal effort. With our user-friendly interface and powerful tools,
            you can easily manage your investments and watch your profits grow.
          </p>
        </div>
        <div className="relative">
          <div className="w-full flex items-center justify-center">
            <Image
              alt="Product"
              className="mt-10"
              height={720}
              src={"/assets/product-image.png"}
              width={720}
            />
          </div>
          <motion.img
            alt="Pyramid"
            className="absolute -right-36 -top-32 hidden md:block"
            height={262}
            src={"/assets/pyramid.png"}
            style={{ translateY }}
            width={262}
          />
          <motion.img
            alt="Tube"
            className="absolute -left-36 bottom-24 hidden md:block"
            height={248}
            src={"/assets/tube.png"}
            style={{ translateY }}
            width={248}
          />
        </div>
      </div>
    </section>
  );
};
