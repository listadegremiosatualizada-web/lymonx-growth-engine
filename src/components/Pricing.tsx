import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "R$ 297",
    period: "/mês",
    badge: null,
    features: [
      "Multiatendimento (3 atendentes)",
      "CRM Kanban básico",
      "Agendamentos",
      "Suporte por e-mail",
    ],
    highlighted: false,
  },
  {
    name: "Ecossistema Completo",
    price: "R$ 697",
    period: "/mês",
    badge: "RECOMENDADO PARA GRANDES OPERAÇÕES",
    features: [
      "Multiatendimento ilimitado",
      "CRM Kanban avançado",
      "IA Inteligente integrada",
      "Agendamentos + Follow-ups",
      "Integrações (Typebot, n8n, Webhooks)",
      "Implantação personalizada",
      "Treinamento estratégico",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    badge: null,
    features: [
      "Tudo do plano Completo",
      "API dedicada",
      "SLA personalizado",
      "Gerente de conta exclusivo",
    ],
    highlighted: false,
  },
];

const Pricing = () => (
  <section id="planos" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-center mb-16"
      >
        Escolha seu <span className="gradient-text">plano</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`glass-card p-8 md:p-10 flex flex-col relative ${
              plan.highlighted
                ? "neon-border md:scale-105 md:-my-4"
                : ""
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground tracking-wide whitespace-nowrap">
                {plan.badge}
              </span>
            )}

            <h3 className="font-display text-xl font-bold text-foreground mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className={`text-4xl font-bold font-display ${plan.highlighted ? "neon-text" : "text-foreground"}`}>
                {plan.price}
              </span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>

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
                plan.highlighted
                  ? "bg-primary text-primary-foreground neon-glow-box hover:brightness-110"
                  : "border border-border text-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {plan.highlighted && <Zap className="w-4 h-4" />}
              {plan.price === "Sob consulta" ? "Fale Conosco" : "Começar Agora"}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
