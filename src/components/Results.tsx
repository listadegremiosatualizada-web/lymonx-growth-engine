import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const testimonials = [
  { quote: "Saímos do caos para uma operação organizada e aumentamos 34% nossa conversão.", author: "Marcelo Ferreira" },
  { quote: "Aumentamos 38% no faturamento apenas organizando o atendimento.", author: "Patrícia Lopes" },
  { quote: "Reduzimos em 61% o tempo médio de resposta.", author: "Fernanda Martins" },
  { quote: "Hoje consigo sair com minha família e sei que as vendas continuam.", author: "Roberto Almeida" },
];

const stats = [
  { value: 35, prefix: "+", suffix: "%", label: "Faturamento" },
  { value: 52, prefix: "+", suffix: "%", label: "Produtividade" },
  { value: 61, prefix: "-", suffix: "%", label: "Tempo de Resposta" },
  { value: 29, prefix: "+", suffix: "%", label: "Taxa de Conversão" },
];

const Counter = ({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = duration / value;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="block text-3xl md:text-5xl lg:text-6xl font-bold font-display neon-text mb-2">
      {prefix}{count}{suffix}
    </span>
  );
};

const Results = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-center mb-6"
      >
        Resultados que <span className="gradient-text">falam</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
      >
        Dados médios nos primeiros 90 dias de uso.
      </motion.p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6 md:p-8 text-center flex flex-col items-center justify-center"
          >
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-wider">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card p-8"
          >
            <Quote className="w-6 h-6 text-primary/40 mb-3" />
            <p className="text-foreground leading-relaxed mb-4">"{t.quote}"</p>
            <p className="text-sm font-semibold text-muted-foreground">— {t.author}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Results;
