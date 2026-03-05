const footerCols = [
  {
    title: "Produtos",
    links: ["Funcionalidades", "Planos", "Depoimentos"],
  },
  {
    title: "Empresa",
    links: ["Quem Somos", "Contato"],
  },
  {
    title: "Suporte",
    links: ["FAQ", "LGPD"],
  },
];

const Footer = () => (
  <footer className="border-t border-border section-padding py-16">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16">
        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-semibold text-foreground mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
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
  </footer>
);

export default Footer;
