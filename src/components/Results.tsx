import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const statsData = [
  { value: 35, prefix: "+", suffix: "%" },
  { value: 52, prefix: "+", suffix: "%" },
  { value: 61, prefix: "-", suffix: "%" },
  { value: 29, prefix: "+", suffix: "%" },
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

const Results = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-center mb-6"
        >
          {t.results.title} <span className="gradient-text">{t.results.titleHighlight}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
        >
          {t.results.description}
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {statsData.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 md:p-8 text-center flex flex-col items-center justify-center"
            >
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-wider">{t.results.statsLabels[i]}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {t.results.testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card p-8"
            >
              <Quote className="w-6 h-6 text-primary/40 mb-3" />
              <p className="text-foreground leading-relaxed mb-4">"{item.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">— {item.author}</p>
                <p className="text-xs text-muted-foreground">{item.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
