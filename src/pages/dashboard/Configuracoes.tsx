import { User, Bell, Shield, Palette, Globe, CreditCard } from "lucide-react";

const sections = [
  { icon: User, title: "Perfil", desc: "Gerencie suas informações pessoais" },
  { icon: Bell, title: "Notificações", desc: "Configure alertas e avisos" },
  { icon: Shield, title: "Segurança", desc: "Senha, 2FA e permissões" },
  { icon: Globe, title: "Integrações", desc: "WhatsApp API, webhooks e APIs externas" },
  { icon: Palette, title: "Personalização", desc: "Temas, cores e marca" },
  { icon: CreditCard, title: "Faturamento", desc: "Plano, pagamentos e faturas" },
];

const Configuracoes = () => (
  <div className="space-y-6 max-w-3xl mx-auto">
    <div>
      <h1 className="text-2xl font-semibold text-dash-fg">Configurações</h1>
      <p className="text-sm text-dash-muted mt-1">Gerencie as preferências da sua conta</p>
    </div>

    <div className="space-y-3">
      {sections.map((s, i) => (
        <div key={i} className="dash-card p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
            <s.icon className="w-5 h-5 text-dash-muted" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-dash-fg">{s.title}</h3>
            <p className="text-xs text-dash-muted">{s.desc}</p>
          </div>
          <span className="text-dash-muted text-lg">›</span>
        </div>
      ))}
    </div>
  </div>
);

export default Configuracoes;
