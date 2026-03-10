import { motion } from "framer-motion";
import { Workflow, LayoutGrid, TrendingUp, Unlock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [Workflow, LayoutGrid, TrendingUp, Unlock];

const Manifesto = () => {
  const { t } = useLanguage();

  return (
    <section id="plataforma" className="section-padding">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-display mb-6 uppercase"
        >
          {t.manifesto.title} <span className="gradient-text">{t.manifesto.titleHighlight}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-16"
        >
          {t.manifesto.description}
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.manifesto.pillars.map((label, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 flex flex-col items-center gap-4 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <span className="font-display font-semibold text-foreground">{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
