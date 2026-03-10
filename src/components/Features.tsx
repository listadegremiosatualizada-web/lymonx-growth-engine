import { motion } from "framer-motion";
import {
  MessageSquare, Users, Kanban, Bot, GitBranch, Zap,
  CheckSquare, Contact, CalendarClock, Tag, MessagesSquare,
  Puzzle, QrCode
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const featureIcons = [
  MessageSquare, Users, Kanban, Bot, GitBranch, Zap,
  CheckSquare, Contact, CalendarClock, Tag, MessagesSquare,
  Puzzle, QrCode,
];

const spans = [
  "md:col-span-2", "", "", "md:col-span-2", "", "", "",
  "md:col-span-2", "", "", "", "md:col-span-2", "",
];

const Features = () => {
  const { t } = useLanguage();

  return (
    <section id="funcionalidades" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-center mb-6"
        >
          {t.features.title} <span className="gradient-text">{t.features.titleHighlight}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
        >
          {t.features.description}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {t.features.items.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`glass-card p-8 group hover:border-primary/30 transition-all duration-300 ${spans[i] || ""}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
