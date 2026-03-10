import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const prices = ["R$ 997", "R$ 697", "R$ 897"];
const periods = ["/mês", "/mês", "/mês"];
const highlighted = [false, true, false];

const Pricing = () => {
  const { t } = useLanguage();

  return (
    <section id="planos" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-center mb-6"
        >
          {t.pricing.title} <span className="gradient-text">{t.pricing.titleHighlight}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
        >
          {t.pricing.description}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {t.pricing.plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card p-8 md:p-10 flex flex-col relative ${
                highlighted[i] ? "neon-border md:scale-105 md:-my-4" : ""
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground tracking-wide whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-4xl font-bold font-display ${highlighted[i] ? "neon-text" : "text-foreground"}`}>
                  {prices[i]}
                </span>
                <span className="text-muted-foreground text-sm">{periods[i]}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">{plan.subtitle}</p>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300 ${
                  highlighted[i]
                    ? "bg-primary text-primary-foreground neon-glow-box hover:brightness-110"
                    : "border border-border text-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {highlighted[i] && <Zap className="w-4 h-4" />}
                {t.pricing.button}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
