import { motion } from "framer-motion";
import { MessageSquare, Kanban, Bot, CalendarClock, Puzzle } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Multiatendimento",
    desc: "Atenda centenas sem filas. WhatsApp, chat e redes — tudo centralizado.",
    span: "md:col-span-2",
  },
  {
    icon: Kanban,
    title: "CRM Kanban",
    desc: "Previsibilidade total de faturamento. Veja cada oportunidade no pipeline.",
    span: "",
  },
  {
    icon: Bot,
    title: "IA Inteligente",
    desc: "Treine seu ChatGPT para vender por você. 24h, sem pausas.",
    span: "",
  },
  {
    icon: CalendarClock,
    title: "Agendamentos",
    desc: "Follow-ups automáticos que aumentam 30% a conversão.",
    span: "",
  },
  {
    icon: Puzzle,
    title: "Integrações",
    desc: "Typebot, n8n e Webhooks nativos. Conecte qualquer ferramenta.",
    span: "",
  },
];

const Features = () => (
  <section id="funcionalidades" className="section-padding">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-center mb-16"
      >
        Ecossistema de <span className="gradient-text">Funcionalidades</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`glass-card p-8 group hover:border-primary/30 transition-all duration-300 ${f.span}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
