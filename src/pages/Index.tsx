import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SocialProof from "@/components/SocialProof";
import Manifesto from "@/components/Manifesto";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Results from "@/components/Results";
import Footer from "@/components/Footer";

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
    </main>
    <Footer />
  </div>
);

export default Index;
