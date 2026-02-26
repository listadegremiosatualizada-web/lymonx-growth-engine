import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Eu vivia apagando incêndios. Hoje tenho equipe organizada e vendo até quando estou fora.",
    author: "Carlos Mendes",
    company: "Mendes Alimentos",
  },
  {
    quote: "A LymonX organizou minha empresa inteira.",
    author: "Juliana Ribeiro",
    company: "Grupo Vida Plena",
  },
];

const SocialProof = () => (
  <section className="section-padding">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          className="glass-card p-8 md:p-10"
        >
          <Quote className="w-8 h-8 text-primary/40 mb-4" />
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
            "{t.quote}"
          </p>
          <div>
            <p className="font-semibold text-foreground">{t.author}</p>
            <p className="text-sm text-muted-foreground">{t.company}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default SocialProof;
