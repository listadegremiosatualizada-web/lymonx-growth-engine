import { motion } from "framer-motion";
import {
  MessageSquare, Users, Kanban, Bot, GitBranch, Zap,
  CheckSquare, Contact, CalendarClock, Tag, MessagesSquare,
  Puzzle, QrCode
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Multiatendimento",
    desc: "Atenda vários clientes ao mesmo tempo, eliminando filas e esquecimentos.",
    span: "md:col-span-2",
  },
  {
    icon: Users,
    title: "Multiusuários",
    desc: "Controle individual de cada colaborador com permissões e histórico rastreável.",
    span: "",
  },
  {
    icon: Kanban,
    title: "CRM em Kanban",
    desc: "Visualize leads, negociações e fechamentos em tempo real.",
    span: "",
  },
  {
    icon: Bot,
    title: "Atendimento Inteligente",
    desc: "Atendimento imediato e qualificação de leads 24h.",
    span: "md:col-span-2",
  },
  {
    icon: GitBranch,
    title: "Filas Inteligentes",
    desc: "Distribuição automática por vendas, suporte e financeiro.",
    span: "",
  },
  {
    icon: Zap,
    title: "Respostas Rápidas",
    desc: "Mensagens pré-configuradas para agilidade e fechamento.",
    span: "",
  },
  {
    icon: CheckSquare,
    title: "Gestão de Tarefas",
    desc: "Transforme negociações em acompanhamento e vendas.",
    span: "",
  },
  {
    icon: Contact,
    title: "Centralização de Contatos",
    desc: "Histórico completo de cada cliente e venda contextual.",
    span: "md:col-span-2",
  },
  {
    icon: CalendarClock,
    title: "Agendamentos Automáticos",
    desc: "Follow-ups programados que aumentam conversão em 30%.",
    span: "",
  },
  {
    icon: Tag,
    title: "Sistema de Tags",
    desc: "Segmentação estratégica: VIP, quente, frio.",
    span: "",
  },
  {
    icon: MessagesSquare,
    title: "Chat Interno",
    desc: "Comunicação interna da equipe sem apps externos e sem ruído.",
    span: "",
  },
  {
    icon: Puzzle,
    title: "Integrações Avançadas",
    desc: "Typebot, n8n, Dialogflow, Webhooks e ChatGPT.",
    span: "md:col-span-2",
  },
  {
    icon: QrCode,
    title: "Conexão via QR Code",
    desc: "Implantação simples, rápida e segura.",
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
        className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-center mb-6"
      >
        Funcionalidades que geram <span className="gradient-text">resultado real</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
      >
        Cada ferramenta foi desenhada para transformar operação em crescimento.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
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
