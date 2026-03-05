import { motion } from "framer-motion";
import { Workflow, LayoutGrid, TrendingUp, Unlock } from "lucide-react";

const pillars = [
  { icon: Workflow, label: "Processos" },
  { icon: LayoutGrid, label: "Organização" },
  { icon: TrendingUp, label: "Escala" },
  { icon: Unlock, label: "Liberdade Operacional" },
];

const Manifesto = () => (
  <section id="plataforma" className="section-padding">
    <div className="max-w-6xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold font-display mb-6 uppercase"
      >
        Não vendemos <span className="gradient-text">sistemas</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-16"
      >
        Vendemos tranquilidade. Vendemos estrutura. Vendemos crescimento previsível.
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {pillars.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-8 flex flex-col items-center gap-4 hover:border-primary/30 transition-colors duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <p.icon className="w-7 h-7 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">{p.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Manifesto;
