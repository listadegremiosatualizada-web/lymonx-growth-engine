import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SocialProof from "@/components/SocialProof";
import Manifesto from "@/components/Manifesto";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Results from "@/components/Results";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <SocialProof />
      <Manifesto />
      <Features />
      <Pricing />
      <Results />
      <CtaFinal />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
