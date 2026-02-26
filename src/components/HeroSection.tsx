import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const phrases = [
  "Imagine…",
  "Uma vida com mais tempo. Tempo para sua família. Tempo para novos projetos. Tempo para viver.",
  "Imagine seus clientes sendo atendidos imediatamente. Mesmo quando você estiver jantando. Mesmo quando estiver dormindo.",
  "Imagine atender dezenas de clientes ao mesmo tempo no WhatsApp. Fechar pedidos. Organizar sua equipe. Escalar suas vendas.",
  "Imagine nunca mais perder dinheiro por falta de atendimento.",
];

const HeroSection = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    if (currentPhrase < phrases.length - 1) {
      const timer = setTimeout(() => setCurrentPhrase((p) => p + 1), 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowMain(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentPhrase]);

  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding pt-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Animated phrases */}
        {!showMain && (
          <div className="min-h-[200px] md:min-h-[260px] flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentPhrase}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-foreground leading-tight"
              >
                {phrases[currentPhrase]}
              </motion.h2>
            </AnimatePresence>
          </div>
        )}

        {/* Main content */}
        {showMain && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-bold font-display leading-tight mb-8">
              <span className="neon-text">Como seria isso para você?</span>
              <br />
              <span className="text-foreground">Seria liberdade. Seria organização. Seria crescimento.</span>
            </h1>

            <motion.a
              href="#planos"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold rounded-full bg-primary text-primary-foreground neon-glow-box hover:brightness-110 transition-all duration-300 animate-pulse-neon"
            >
              <Zap className="w-5 h-5" />
              Comece Agora – Entre no Ecossistema LymonX
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
