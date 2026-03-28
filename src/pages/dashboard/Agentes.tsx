import { Bot, Plus, MoreHorizontal, Zap, MessageCircle, Clock } from "lucide-react";

const agents = [
  { name: "Atendente Geral", desc: "Responde perguntas frequentes e direciona para o setor correto", status: "active", conversations: 1247, responseTime: "< 3s", satisfaction: "94%" },
  { name: "Vendas Pro", desc: "Qualifica leads e apresenta produtos/serviços automaticamente", status: "active", conversations: 856, responseTime: "< 2s", satisfaction: "91%" },
  { name: "Suporte Técnico", desc: "Resolve dúvidas técnicas e abre tickets quando necessário", status: "active", conversations: 432, responseTime: "< 5s", satisfaction: "89%" },
  { name: "Agendamento", desc: "Agenda reuniões e consultas integrando com calendário", status: "paused", conversations: 198, responseTime: "< 4s", satisfaction: "96%" },
];

const Agentes = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-dash-fg">Agentes de IA</h1>
        <p className="text-sm text-dash-muted mt-1">Configure e gerencie seus assistentes inteligentes</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition">
        <Plus className="w-4 h-4" /> Novo Agente
      </button>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {agents.map((a, i) => (
        <div key={i} className="dash-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-dash-fg">{a.name}</h3>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${a.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                  {a.status === "active" ? "Ativo" : "Pausado"}
                </span>
              </div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-dash-muted"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-dash-muted mb-4">{a.desc}</p>
          <div className="flex items-center gap-4 text-xs text-dash-muted">
            <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{a.conversations.toLocaleString()} conversas</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{a.responseTime}</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{a.satisfaction} satisfação</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Agentes;
