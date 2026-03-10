import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const CtaFinal = () => (
  <section className="section-padding">
    <div className="max-w-4xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold font-display mb-8 leading-tight"
      >
        Pare de <span className="text-primary">perder vendas.</span>
        <br />
        Viva a <span className="text-primary">liberdade de tempo.</span>
      </motion.h2>

      <motion.a
        href="#planos"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold rounded-full bg-primary text-primary-foreground neon-glow-box hover:brightness-110 transition-all duration-300 animate-pulse-neon"
      >
        <Zap className="w-5 h-5" />
        Comece Agora – Entre no Ecossistema LymonX
      </motion.a>
    </div>
  </section>
);

export default CtaFinal;
