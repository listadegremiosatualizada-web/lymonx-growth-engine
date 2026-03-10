import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X, ArrowLeft } from "lucide-react";
import logoLymonx from "@/assets/logo-lymonx.png";

const footerCols = [
  {
    title: "Produtos",
    links: [
      { label: "Funcionalidades", href: "#funcionalidades" },
      { label: "Planos", href: "#planos" },
      { label: "Depoimentos", href: "#depoimentos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Quem Somos", href: "#plataforma" },
      { label: "Contato", href: "#contato" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "LGPD", href: "#lgpd" },
    ],
  },
];

type ModalKey = "faq" | "lgpd" | "contato" | null;

const modalContent: Record<string, { title: string; body: string }> = {
  faq: {
    title: "Perguntas Frequentes",
    body: "Entre em contato pelo WhatsApp para tirar suas dúvidas. Nossa equipe responde em até 5 minutos durante o horário comercial.",
  },
  lgpd: {
    title: "Política de Privacidade — LGPD",
    body: "A LymonX respeita sua privacidade. Todos os dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD). Para mais informações, entre em contato conosco.",
  },
  contato: {
    title: "Contato",
    body: "Fale conosco pelo WhatsApp ou envie um e-mail para contato@lymonx.com. Estamos sempre prontos para ajudar.",
  },
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Footer = () => {
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  const handleLinkClick = (href: string, label: string) => {
    const key = label.toLowerCase() as ModalKey;
    if (key && modalContent[key]) {
      setOpenModal(key);
    }
    // anchor links still work for sections that exist
  };

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
                          const key = link.label.toLowerCase() as ModalKey;
                          if (key && modalContent[key]) {
                            e.preventDefault();
                            handleLinkClick(link.href, link.label);
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
            <a href="#" className="text-xl font-bold font-display neon-text">LymonX</a>
            <p className="text-sm text-muted-foreground">
              © 2026 LymonX. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Empresa do Grupo{" "}
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

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="absolute right-6 bottom-6 md:right-10 md:bottom-10 p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 group"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      </footer>

      {/* Modal overlay */}
      <AnimatePresence>
        {openModal && modalContent[openModal] && (
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
              {/* Close button */}
              <button
                onClick={() => setOpenModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold font-display text-foreground mb-4">
                {modalContent[openModal].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {modalContent[openModal].body}
              </p>

              {/* Back button */}
              <button
                onClick={() => setOpenModal(null)}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft size={14} />
                Voltar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
