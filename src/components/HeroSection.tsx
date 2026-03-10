import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  const phrases = [...t.hero.phrases];
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    setCurrentPhrase(0);
    setShowMain(false);
  }, [t]);

  useEffect(() => {
    if (currentPhrase < phrases.length - 1) {
      const timer = setTimeout(() => setCurrentPhrase((p) => p + 1), 2200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowMain(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPhrase, phrases.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding pt-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {!showMain && (
          <div className="h-[120px] md:h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentPhrase}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-foreground"
              >
                {phrases[currentPhrase]}
              </motion.h2>
            </AnimatePresence>
          </div>
        )}

        {showMain && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-bold font-display leading-tight mb-8">
              <span className="gradient-text">LymonX:</span>{" "}
              <span className="text-foreground">{t.hero.title}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              {t.hero.description}{" "}
              <span className="text-foreground font-medium">{t.hero.descHighlight}</span> {t.hero.descEnd}
            </p>

            <motion.a
              href="#planos"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold rounded-full bg-primary text-primary-foreground neon-glow-box hover:brightness-110 transition-all duration-300 animate-pulse-neon"
            >
              <Zap className="w-5 h-5" />
              {t.hero.button}
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
