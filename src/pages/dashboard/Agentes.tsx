import { useState } from "react";
import { Bot, Plus, Edit2, X, Check, Power, Zap, MessageCircle, HeadphonesIcon, Clock, MoreHorizontal } from "lucide-react";

type AgentType = "SDR" | "Vendas" | "Suporte";

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  prompt: string;
  active: boolean;
  conversations: number;
  responseTime: string;
  satisfaction: string;
}

const typeConfig: Record<AgentType, { color: string; bg: string; icon: typeof Bot }> = {
  SDR: { color: "text-blue-600", bg: "bg-blue-50", icon: Zap },
  Vendas: { color: "text-emerald-600", bg: "bg-emerald-50", icon: MessageCircle },
  Suporte: { color: "text-violet-600", bg: "bg-violet-50", icon: HeadphonesIcon },
};

const defaultAgents: Agent[] = [
  {
    id: "1",
    name: "SDR Inteligente",
    type: "SDR",
    prompt: `Você é um SDR (Sales Development Representative) especializado em qualificação de leads via WhatsApp.\n\nSeu objetivo é:\n1. Cumprimentar o lead de forma cordial\n2. Identificar a necessidade do cliente\n3. Qualificar usando BANT (Budget, Authority, Need, Timeline)\n4. Agendar uma reunião com o time de vendas\n\nRegras:\n- Seja objetivo e profissional\n- Use linguagem informal mas respeitosa\n- Não faça promessas sobre preços\n- Encaminhe leads qualificados para o time de vendas`,
    active: true,
    conversations: 1247,
    responseTime: "< 3s",
    satisfaction: "94%",
  },
  {
    id: "2",
    name: "Consultor de Vendas",
    type: "Vendas",
    prompt: `Você é um consultor de vendas especializado em fechamento.\n\nSeu objetivo é:\n1. Apresentar os planos e benefícios\n2. Responder objeções com empatia\n3. Criar senso de urgência\n4. Conduzir o cliente ao fechamento\n\nRegras:\n- Conheça todos os planos e preços\n- Use técnicas de storytelling\n- Ofereça bônus para decisão imediata\n- Sempre apresente cases de sucesso`,
    active: true,
    conversations: 856,
    responseTime: "< 2s",
    satisfaction: "91%",
  },
  {
    id: "3",
    name: "Suporte Técnico",
    type: "Suporte",
    prompt: `Você é um agente de suporte técnico especializado.\n\nSeu objetivo é:\n1. Identificar o problema do cliente\n2. Oferecer soluções passo a passo\n3. Escalar para humano quando necessário\n4. Garantir satisfação do cliente\n\nRegras:\n- Seja empático e paciente\n- Use linguagem simples e clara\n- Peça screenshots quando necessário\n- Registre todos os problemas reportados`,
    active: false,
    conversations: 432,
    responseTime: "< 5s",
    satisfaction: "89%",
  },
];

const Agentes = () => {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Agent | null>(null);

  const toggleActive = (id: string) => {
    setAgents(agents.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const openEdit = (agent: Agent) => {
    setEditingAgent({ ...agent });
    setShowForm(true);
  };

  const openNewAgent = () => {
    setEditingAgent({
      id: Date.now().toString(),
      name: "",
      type: "SDR",
      prompt: "",
      active: true,
      conversations: 0,
      responseTime: "< 3s",
      satisfaction: "0%",
    });
    setShowForm(true);
  };

  const saveAgent = () => {
    if (!editingAgent || !editingAgent.name.trim()) return;
    const exists = agents.find((a) => a.id === editingAgent.id);
    if (exists) {
      setAgents(agents.map((a) => (a.id === editingAgent.id ? editingAgent : a)));
    } else {
      setAgents([...agents, editingAgent]);
    }
    setShowForm(false);
    setEditingAgent(null);
  };

  const savePrompt = () => {
    if (!editingPrompt) return;
    setAgents(agents.map((a) => (a.id === editingPrompt.id ? editingPrompt : a)));
    setEditingPrompt(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-fg">Agentes de IA</h1>
          <p className="text-sm text-dash-muted mt-1">Configure e gerencie seus assistentes inteligentes</p>
        </div>
        <button
          onClick={openNewAgent}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" /> Novo Agente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="dash-card p-4 text-center">
          <p className="text-2xl font-semibold text-dash-fg">{agents.filter((a) => a.active).length}</p>
          <p className="text-xs text-dash-muted mt-1">Agentes Ativos</p>
        </div>
        <div className="dash-card p-4 text-center">
          <p className="text-2xl font-semibold text-dash-fg">
            {agents.reduce((s, a) => s + a.conversations, 0).toLocaleString()}
          </p>
          <p className="text-xs text-dash-muted mt-1">Total de Conversas</p>
        </div>
        <div className="dash-card p-4 text-center">
          <p className="text-2xl font-semibold text-dash-fg">
            {Math.round(
              agents.reduce((s, a) => s + parseFloat(a.satisfaction), 0) / agents.length
            )}%
          </p>
          <p className="text-xs text-dash-muted mt-1">Satisfação Média</p>
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const cfg = typeConfig[agent.type];
          const Icon = cfg.icon;
          return (
            <div key={agent.id} className="dash-card p-5 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${cfg.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${cfg.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-dash-fg">{agent.name}</h3>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      {agent.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(agent.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    agent.active ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      agent.active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${agent.active ? "bg-emerald-500" : "bg-gray-300"}`} />
                <span className={`text-xs font-medium ${agent.active ? "text-emerald-600" : "text-gray-400"}`}>
                  {agent.active ? "Ativo" : "Inativo"}
                </span>
              </div>

              {/* Prompt preview */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 flex-1">
                <p className="text-[11px] font-medium text-dash-muted mb-1">Prompt:</p>
                <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line leading-relaxed">
                  {agent.prompt}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-[11px] text-dash-muted mb-4">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {agent.conversations.toLocaleString()} conversas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {agent.responseTime}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {agent.satisfaction}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPrompt({ ...agent })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-dash-fg bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar Prompt
                </button>
                <button
                  onClick={() => openEdit(agent)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-dash-muted hover:bg-gray-50 rounded-xl transition"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit prompt modal */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-dash-fg">Editar Prompt</h3>
                <p className="text-sm text-dash-muted">{editingPrompt.name}</p>
              </div>
              <button onClick={() => setEditingPrompt(null)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={editingPrompt.prompt}
              onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt: e.target.value })}
              className="flex-1 min-h-[300px] p-4 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none font-mono leading-relaxed"
              placeholder="Digite o prompt do agente..."
            />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingPrompt(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">
                Cancelar
              </button>
              <button onClick={savePrompt} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:brightness-110 transition">
                <Check className="w-4 h-4" /> Salvar Prompt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/New agent modal */}
      {showForm && editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dash-fg">
                {agents.find((a) => a.id === editingAgent.id) ? "Editar Agente" : "Novo Agente"}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingAgent(null); }} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Nome *</label>
                <input
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                  placeholder="Nome do agente"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Tipo</label>
                <select
                  value={editingAgent.type}
                  onChange={(e) => setEditingAgent({ ...editingAgent, type: e.target.value as AgentType })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="SDR">SDR</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Suporte">Suporte</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Prompt</label>
                <textarea
                  value={editingAgent.prompt}
                  onChange={(e) => setEditingAgent({ ...editingAgent, prompt: e.target.value })}
                  rows={5}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none font-mono"
                  placeholder="Instruções do agente..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowForm(false); setEditingAgent(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">
                Cancelar
              </button>
              <button
                onClick={saveAgent}
                disabled={!editingAgent.name.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:brightness-110 transition disabled:opacity-40"
              >
                <Check className="w-4 h-4" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agentes;
