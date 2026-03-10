import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const SocialProof = () => {
  const { t } = useLanguage();

  return (
    <section id="depoimentos" className="section-padding">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {t.socialProof.testimonials.map((item, i) => (
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
              "{item.quote}"
            </p>
            <div>
              <p className="font-semibold text-foreground">{item.author}</p>
              <p className="text-sm text-muted-foreground">{item.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
