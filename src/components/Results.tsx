import { motion } from "framer-motion";

const stats = [
  { value: "+35%", label: "Faturamento" },
  { value: "-61%", label: "Tempo de Resposta" },
  { value: "+52%", label: "Produtividade" },
];

const Results = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold font-display text-center mb-16"
      >
        Resultados que <span className="gradient-text">falam</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-10 md:p-12 text-center"
          >
            <span className="block text-5xl md:text-7xl font-bold font-display neon-text mb-3">
              {s.value}
            </span>
            <span className="text-muted-foreground text-lg">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Results;
