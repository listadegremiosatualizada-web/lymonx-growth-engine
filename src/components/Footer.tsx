import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X, ArrowLeft } from "lucide-react";
import logoLymonx from "@/assets/logo-lymonx.png";
import { useLanguage } from "@/i18n/LanguageContext";

type ModalKey = "faq" | "lgpd" | "contato" | null;

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Footer = () => {
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const { t } = useLanguage();

  const footerCols = [
    {
      title: t.footer.products,
      links: [
        { label: t.footer.links.features, href: "#funcionalidades" },
        { label: t.footer.links.plans, href: "#planos" },
        { label: t.footer.links.testimonials, href: "#depoimentos" },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.links.about, href: "#plataforma" },
        { label: t.footer.links.contact, href: "#contato", modal: "contato" as ModalKey },
      ],
    },
    {
      title: t.footer.support,
      links: [
        { label: t.footer.links.faq, href: "#faq", modal: "faq" as ModalKey },
        { label: t.footer.links.lgpd, href: "#lgpd", modal: "lgpd" as ModalKey },
      ],
    },
  ];

  return (
    <>
      <footer className="bg-background border-t border-border section-padding py-16 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16">
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 className="font-display font-semibold text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          const modal = (link as any).modal as ModalKey;
                          if (modal) {
                            e.preventDefault();
                            setOpenModal(modal);
                          }
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
            <a href="#">
              <img src={logoLymonx} alt="LymonX" className="h-8 w-auto" />
            </a>
            <p className="text-sm text-muted-foreground">
              © 2026 LymonX. {t.footer.rights}
            </p>
            <p className="text-sm text-muted-foreground mr-16">
              {t.footer.groupLabel}{" "}
              <a
                href="https://www.wayweb.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                Wayweb
              </a>
            </p>
          </div>
        </div>

        <button
          onClick={scrollToTop}
          className="absolute right-6 bottom-6 md:right-10 md:bottom-10 p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 group"
          aria-label={t.footer.backToTop}
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      </footer>

      <AnimatePresence>
        {openModal && t.footer.modals[openModal] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setOpenModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="glass-card p-8 md:p-10 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold font-display text-foreground mb-4">
                {t.footer.modals[openModal].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t.footer.modals[openModal].body}
              </p>

              <button
                onClick={() => setOpenModal(null)}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft size={14} />
                {t.footer.back}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
