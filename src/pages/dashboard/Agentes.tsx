import { useState, useEffect } from "react";
import { Bot, Plus, Edit2, X, Check, Zap, MessageCircle, HeadphonesIcon, Clock, MoreHorizontal, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

const Agentes = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Agent | null>(null);

  const fetchAgents = async () => {
    if (!user) return;
    const { data } = await supabase.from("agents").select("*").order("created_at", { ascending: true });
    if (data) {
      setAgents(data.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type as AgentType,
        prompt: a.prompt || "",
        active: a.is_active ?? true,
        conversations: a.conversations ?? 0,
        responseTime: a.response_time || "< 3s",
        satisfaction: a.satisfaction || "0%",
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchAgents(); }, [user]);

  const toggleActive = async (id: string) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;
    const newActive = !agent.active;
    setAgents(agents.map((a) => (a.id === id ? { ...a, active: newActive } : a)));
    await supabase.from("agents").update({ is_active: newActive }).eq("id", id);
  };

  const openEdit = (agent: Agent) => { setEditingAgent({ ...agent }); setShowForm(true); };
  const openNewAgent = () => {
    setEditingAgent({ id: "", name: "", type: "SDR", prompt: "", active: true, conversations: 0, responseTime: "< 3s", satisfaction: "0%" });
    setShowForm(true);
  };

  const saveAgent = async () => {
    if (!editingAgent || !editingAgent.name.trim() || !user) return;
    if (editingAgent.id) {
      await supabase.from("agents").update({
        name: editingAgent.name, type: editingAgent.type, prompt: editingAgent.prompt,
      }).eq("id", editingAgent.id);
    } else {
      await supabase.from("agents").insert({
        name: editingAgent.name, type: editingAgent.type, prompt: editingAgent.prompt,
        user_id: user.id, is_active: true,
      });
    }
    setShowForm(false);
    setEditingAgent(null);
    fetchAgents();
  };

  const savePrompt = async () => {
    if (!editingPrompt) return;
    await supabase.from("agents").update({ prompt: editingPrompt.prompt }).eq("id", editingPrompt.id);
    setAgents(agents.map((a) => (a.id === editingPrompt.id ? { ...a, prompt: editingPrompt.prompt } : a)));
    setEditingPrompt(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-fg">Agentes de IA</h1>
          <p className="text-sm text-dash-muted mt-1">Configure e gerencie seus assistentes inteligentes</p>
        </div>
        <button onClick={openNewAgent} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition">
          <Plus className="w-4 h-4" /> Novo Agente
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="dash-card p-4 text-center">
          <p className="text-2xl font-semibold text-dash-fg">{agents.filter((a) => a.active).length}</p>
          <p className="text-xs text-dash-muted mt-1">Agentes Ativos</p>
        </div>
        <div className="dash-card p-4 text-center">
          <p className="text-2xl font-semibold text-dash-fg">{agents.reduce((s, a) => s + a.conversations, 0).toLocaleString()}</p>
          <p className="text-xs text-dash-muted mt-1">Total de Conversas</p>
        </div>
        <div className="dash-card p-4 text-center">
          <p className="text-2xl font-semibold text-dash-fg">
            {agents.length > 0 ? Math.round(agents.reduce((s, a) => s + parseFloat(a.satisfaction), 0) / agents.length) : 0}%
          </p>
          <p className="text-xs text-dash-muted mt-1">Satisfação Média</p>
        </div>
      </div>

      {agents.length === 0 && (
        <div className="dash-card p-12 text-center">
          <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Nenhum agente criado ainda</p>
          <button onClick={openNewAgent} className="mt-3 text-sm text-primary font-medium hover:underline">Criar primeiro agente</button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const cfg = typeConfig[agent.type] || typeConfig.SDR;
          const Icon = cfg.icon;
          return (
            <div key={agent.id} className="dash-card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${cfg.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${cfg.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-dash-fg">{agent.name}</h3>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{agent.type}</span>
                  </div>
                </div>
                <button onClick={() => toggleActive(agent.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${agent.active ? "bg-primary" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${agent.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${agent.active ? "bg-emerald-500" : "bg-gray-300"}`} />
                <span className={`text-xs font-medium ${agent.active ? "text-emerald-600" : "text-gray-400"}`}>{agent.active ? "Ativo" : "Inativo"}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-4 flex-1">
                <p className="text-[11px] font-medium text-dash-muted mb-1">Prompt:</p>
                <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line leading-relaxed">{agent.prompt || "Sem prompt configurado"}</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-dash-muted mb-4">
                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{agent.conversations.toLocaleString()} conversas</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{agent.responseTime}</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{agent.satisfaction}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingPrompt({ ...agent })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-dash-fg bg-gray-50 hover:bg-gray-100 rounded-xl transition">
                  <Edit2 className="w-3.5 h-3.5" /> Editar Prompt
                </button>
                <button onClick={() => openEdit(agent)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-dash-muted hover:bg-gray-50 rounded-xl transition">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-dash-fg">Editar Prompt</h3>
                <p className="text-sm text-dash-muted">{editingPrompt.name}</p>
              </div>
              <button onClick={() => setEditingPrompt(null)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <textarea value={editingPrompt.prompt} onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt: e.target.value })}
              className="flex-1 min-h-[300px] p-4 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none font-mono leading-relaxed"
              placeholder="Digite o prompt do agente..." />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingPrompt(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancelar</button>
              <button onClick={savePrompt} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:brightness-110 transition">
                <Check className="w-4 h-4" /> Salvar Prompt
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dash-fg">{editingAgent.id ? "Editar Agente" : "Novo Agente"}</h3>
              <button onClick={() => { setShowForm(false); setEditingAgent(null); }} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Nome *</label>
                <input value={editingAgent.name} onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Nome do agente" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Tipo</label>
                <select value={editingAgent.type} onChange={(e) => setEditingAgent({ ...editingAgent, type: e.target.value as AgentType })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="SDR">SDR</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Suporte">Suporte</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Prompt</label>
                <textarea value={editingAgent.prompt} onChange={(e) => setEditingAgent({ ...editingAgent, prompt: e.target.value })} rows={5}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none font-mono" placeholder="Instruções do agente..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowForm(false); setEditingAgent(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancelar</button>
              <button onClick={saveAgent} disabled={!editingAgent.name.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:brightness-110 transition disabled:opacity-40">
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
