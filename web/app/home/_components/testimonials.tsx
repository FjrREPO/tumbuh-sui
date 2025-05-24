"use client";

import TestimonialsColumn from "./testimonials-columns";

import { useVaults } from "@/hooks/query/api/use-vaults";

export const Testimonials = () => {
  const { data: vaults } = useVaults();

  if (!vaults) {
    return null;
  }

  const firstVaults = vaults.slice(0, 3);
  const secondVaults = vaults.slice(3, 6);
  const thirdVaults = vaults.slice(6, 9);

  return (
    <section className="py-24">
      <div className="container">
        <div className="flex justify-center">
          <div className="tag">Protocols</div>
        </div>
        <div className="section-heading">
          <h2 className="section-title mt-5">
            Lot of protocols, endless possibilities.
          </h2>
          <p className="section-description mt-5">
            Numerous protocols are available, offering updates on vault changes,
            APY, and TVL daily.
          </p>
        </div>
        <div className="mt-10 flex max-h-[738px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn columnData={firstVaults} duration={15} />
          <TestimonialsColumn
            className="hidden md:block"
            columnData={secondVaults}
            duration={19}
          />
          <TestimonialsColumn
            className="hidden lg:block"
            columnData={thirdVaults}
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
