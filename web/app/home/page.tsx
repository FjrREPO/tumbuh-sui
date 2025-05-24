import { CallToAction } from "./_components/call-to-action";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { LogoTicker } from "./_components/logo-ticker";
import { ProductShowcase } from "./_components/product-showcase";

export default function page() {
  return (
    <div className="flex flex-col">
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      {/* <Testimonials /> */}
      <CallToAction />
      <Footer />
    </div>
  );
}
