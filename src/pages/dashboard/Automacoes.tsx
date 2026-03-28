import { Workflow, Plus, MoreHorizontal, Play, Pause } from "lucide-react";

const automations = [
  { name: "Boas-vindas WhatsApp", desc: "Envia mensagem de boas-vindas para novos contatos", status: "active", triggers: "Novo contato", runs: 3420 },
  { name: "Follow-up 24h", desc: "Envia follow-up após 24h sem resposta do cliente", status: "active", triggers: "Sem resposta", runs: 1856 },
  { name: "Qualificação de Lead", desc: "Classifica leads com base nas respostas do formulário", status: "active", triggers: "Formulário preenchido", runs: 987 },
  { name: "Notificação de Venda", desc: "Notifica equipe quando uma venda é fechada", status: "paused", triggers: "Venda fechada", runs: 234 },
  { name: "Pesquisa de Satisfação", desc: "Envia pesquisa NPS após atendimento finalizado", status: "active", triggers: "Atendimento encerrado", runs: 1543 },
];

const Automacoes = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-dash-fg">Automações</h1>
        <p className="text-sm text-dash-muted mt-1">Crie fluxos automáticos para otimizar seu atendimento</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition">
        <Plus className="w-4 h-4" /> Nova Automação
      </button>
    </div>

    <div className="space-y-3">
      {automations.map((a, i) => (
        <div key={i} className="dash-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
            <Workflow className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-dash-fg">{a.name}</h3>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${a.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                {a.status === "active" ? "Ativo" : "Pausado"}
              </span>
            </div>
            <p className="text-xs text-dash-muted mt-0.5">{a.desc}</p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <p className="text-xs text-dash-muted">Gatilho: {a.triggers}</p>
            <p className="text-xs text-dash-muted">{a.runs.toLocaleString()} execuções</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2 rounded-xl hover:bg-gray-100 text-dash-muted">
              {a.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 text-dash-muted"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Automacoes;
