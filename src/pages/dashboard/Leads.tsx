import { useState, useEffect } from "react";
import { Plus, GripVertical, Phone, Globe, Edit2, X, Check, UserPlus, Kanban, MessageCircle, Monitor, Megaphone, Share2, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Stage = "novo" | "qualificando" | "proposta" | "fechado" | "perdido";

interface Lead {
  id: string;
  name: string;
  phone: string;
  origin: string;
  interest: string;
  stage: Stage;
  value?: string;
  createdAt: string;
}

const stages: { key: Stage; label: string; color: string; dot: string }[] = [
  { key: "novo", label: "Novo Lead", color: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  { key: "qualificando", label: "Qualificando", color: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  { key: "proposta", label: "Proposta", color: "bg-violet-50 border-violet-200", dot: "bg-violet-500" },
  { key: "fechado", label: "Fechado", color: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  { key: "perdido", label: "Perdido", color: "bg-red-50 border-red-200", dot: "bg-red-400" },
];

const origins = [
  { value: "WhatsApp", icon: MessageCircle, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { value: "Site", icon: Monitor, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { value: "Campanha", icon: Megaphone, color: "bg-violet-50 text-violet-600 border-violet-200" },
  { value: "Instagram", icon: Share2, color: "bg-pink-50 text-pink-600 border-pink-200" },
  { value: "Indicação", icon: Sparkles, color: "bg-amber-50 text-amber-600 border-amber-200" },
];

const interests = ["Plano Basic", "Plano Pro", "Plano Enterprise", "Automação", "Integração API", "Consultoria", "Suporte", "Outro"];

const Leads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<"kanban" | "captacao">("kanban");
  const [capture, setCapture] = useState({ name: "", phone: "", origin: "WhatsApp", interest: "" });
  const [saved, setSaved] = useState(false);

  const fetchLeads = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setLeads(data.map((l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone || "",
        origin: l.origin || "WhatsApp",
        interest: l.interest || "",
        stage: (l.stage || "novo") as Stage,
        value: l.value || "",
        createdAt: new Date(l.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }),
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [user]);

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragEnd = () => { setDraggedId(null); setDragOverStage(null); };
  const handleDragOver = (e: React.DragEvent, stage: Stage) => { e.preventDefault(); setDragOverStage(stage); };
  const handleDrop = async (stage: Stage) => {
    if (!draggedId) return;
    setLeads(leads.map((l) => (l.id === draggedId ? { ...l, stage } : l)));
    await supabase.from("leads").update({ stage }).eq("id", draggedId);
    setDraggedId(null);
    setDragOverStage(null);
  };

  const openNewLead = () => {
    setEditingLead({ id: "", name: "", phone: "", origin: "WhatsApp", interest: "", stage: "novo", value: "", createdAt: "" });
    setShowForm(true);
  };
  const openEditLead = (lead: Lead) => { setEditingLead({ ...lead }); setShowForm(true); };

  const saveLead = async () => {
    if (!editingLead || !editingLead.name.trim() || !user) return;
    if (editingLead.id) {
      await supabase.from("leads").update({
        name: editingLead.name, phone: editingLead.phone, origin: editingLead.origin,
        interest: editingLead.interest, stage: editingLead.stage, value: editingLead.value,
      }).eq("id", editingLead.id);
    } else {
      await supabase.from("leads").insert({
        name: editingLead.name, phone: editingLead.phone, origin: editingLead.origin,
        interest: editingLead.interest, stage: editingLead.stage, value: editingLead.value,
        user_id: user.id,
      });
    }
    setShowForm(false);
    setEditingLead(null);
    fetchLeads();
  };

  const cancelForm = () => { setShowForm(false); setEditingLead(null); };

  const saveCapture = async () => {
    if (!capture.name.trim() || !capture.phone.trim() || !user) return;
    await supabase.from("leads").insert({
      name: capture.name, phone: capture.phone, origin: capture.origin,
      interest: capture.interest, stage: "novo", user_id: user.id,
    });
    setCapture({ name: "", phone: "", origin: "WhatsApp", interest: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    fetchLeads();
  };

  const getLeadsByStage = (stage: Stage) => leads.filter((l) => l.stage === stage);
  const totalValue = (stage: Stage) => {
    const total = getLeadsByStage(stage).reduce((sum, l) => {
      const num = parseFloat((l.value || "0").replace(/[^\d,]/g, "").replace(",", "."));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const recentLeads = [...leads].slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-5 max-w-full mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-fg">Leads (CRM)</h1>
          <p className="text-sm text-dash-muted mt-1">Capture e gerencie seus leads</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-0.5 rounded-xl">
            <button onClick={() => setTab("captacao")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${tab === "captacao" ? "bg-white text-dash-fg shadow-sm" : "text-gray-500"}`}>
              <UserPlus className="w-3.5 h-3.5" /> Captação
            </button>
            <button onClick={() => setTab("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${tab === "kanban" ? "bg-white text-dash-fg shadow-sm" : "text-gray-500"}`}>
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>
          {tab === "kanban" && (
            <button onClick={openNewLead} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition">
              <Plus className="w-4 h-4" /> Novo Lead
            </button>
          )}
        </div>
      </div>

      {tab === "captacao" && (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="dash-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-dash-fg">Captar Lead</h2>
                  <p className="text-xs text-dash-muted">Preencha os dados para adicionar ao CRM</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-dash-muted mb-1.5 block">Nome *</label>
                  <input value={capture.name} onChange={(e) => setCapture({ ...capture, name: e.target.value })}
                    className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Nome completo" />
                </div>
                <div>
                  <label className="text-xs font-medium text-dash-muted mb-1.5 block">Telefone *</label>
                  <input value={capture.phone} onChange={(e) => setCapture({ ...capture, phone: e.target.value })}
                    className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="(00) 00000-0000" />
                </div>
                <div>
                  <label className="text-xs font-medium text-dash-muted mb-1.5 block">Origem do Lead</label>
                  <div className="grid grid-cols-2 gap-2">
                    {origins.map((o) => {
                      const Icon = o.icon;
                      const isSelected = capture.origin === o.value;
                      return (
                        <button key={o.value} onClick={() => setCapture({ ...capture, origin: o.value })}
                          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                            isSelected ? `${o.color} border-current` : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                          }`}>
                          <Icon className="w-3.5 h-3.5" /> {o.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-dash-muted mb-1.5 block">Interesse</label>
                  <select value={capture.interest} onChange={(e) => setCapture({ ...capture, interest: e.target.value })}
                    className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Selecione o interesse</option>
                    {interests.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <button onClick={saveCapture} disabled={!capture.name.trim() || !capture.phone.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-primary text-white rounded-xl hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  {saved ? <><CheckCircle2 className="w-4 h-4" /> Lead salvo com sucesso!</> : <><UserPlus className="w-4 h-4" /> Salvar Lead</>}
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="dash-card p-5 mb-4">
              <h3 className="text-sm font-semibold text-dash-fg mb-3">Visão rápida do funil</h3>
              <div className="flex gap-2">
                {stages.map((s) => {
                  const count = getLeadsByStage(s.key).length;
                  return (
                    <div key={s.key} className={`flex-1 rounded-xl border p-3 text-center ${s.color}`}>
                      <p className="text-lg font-bold text-dash-fg">{count}</p>
                      <p className="text-[10px] text-dash-muted">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="dash-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-dash-fg">Leads recentes</h3>
                <button onClick={() => setTab("kanban")} className="text-xs text-primary font-medium hover:underline">Ver Kanban →</button>
              </div>
              <div className="space-y-2">
                {recentLeads.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Nenhum lead cadastrado</p>}
                {recentLeads.map((lead) => {
                  const originCfg = origins.find((o) => o.value === lead.origin);
                  const OriginIcon = originCfg?.icon || Globe;
                  return (
                    <div key={lead.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-gray-600">{lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-dash-fg">{lead.name}</span>
                          <span className="text-[10px] text-dash-muted">{lead.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-dash-muted flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{lead.phone}</span>
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${originCfg?.color || "bg-gray-100 text-gray-500"}`}>{lead.origin}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 12rem)" }}>
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key);
            const isOver = dragOverStage === stage.key;
            return (
              <div key={stage.key}
                className={`flex-1 min-w-[240px] max-w-[280px] flex flex-col rounded-2xl border transition-all duration-200 ${stage.color} ${isOver ? "ring-2 ring-primary/30 scale-[1.01]" : ""}`}
                onDragOver={(e) => handleDragOver(e, stage.key)} onDragLeave={() => setDragOverStage(null)} onDrop={() => handleDrop(stage.key)}>
                <div className="px-4 py-3 border-b border-black/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.dot}`} />
                      <span className="text-sm font-semibold text-dash-fg">{stage.label}</span>
                      <span className="text-[11px] font-medium text-dash-muted bg-white/70 px-1.5 py-0.5 rounded-md">{stageLeads.length}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-dash-muted mt-1">{totalValue(stage.key)}</p>
                </div>
                <div className="flex-1 p-2 space-y-2 overflow-auto">
                  {stageLeads.map((lead) => {
                    const originCfg = origins.find((o) => o.value === lead.origin);
                    return (
                      <div key={lead.id} draggable onDragStart={() => handleDragStart(lead.id)} onDragEnd={handleDragEnd}
                        className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 group ${draggedId === lead.id ? "opacity-40 scale-95" : ""}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            <span className="text-sm font-medium text-dash-fg">{lead.name}</span>
                          </div>
                          <button onClick={() => openEditLead(lead)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="space-y-1 text-[11px] text-dash-muted">
                          <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /><span>{lead.phone}</span></div>
                          <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /><span>{lead.origin}</span></div>
                          {lead.interest && <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /><span>{lead.interest}</span></div>}
                        </div>
                        {lead.value && <div className="mt-2 text-xs font-semibold text-primary">{lead.value}</div>}
                      </div>
                    );
                  })}
                  {stageLeads.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">Arraste um lead aqui</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dash-fg">{editingLead.id ? "Editar Lead" : "Novo Lead"}</h3>
              <button onClick={cancelForm} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Nome *</label>
                <input value={editingLead.name} onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Nome do lead" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Telefone</label>
                <input value={editingLead.phone} onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Origem</label>
                <select value={editingLead.origin} onChange={(e) => setEditingLead({ ...editingLead, origin: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20">
                  {origins.map((o) => <option key={o.value} value={o.value}>{o.value}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Interesse</label>
                <select value={editingLead.interest} onChange={(e) => setEditingLead({ ...editingLead, interest: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Selecione</option>
                  {interests.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Valor</label>
                <input value={editingLead.value || ""} onChange={(e) => setEditingLead({ ...editingLead, value: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="R$ 0,00" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Etapa</label>
                <select value={editingLead.stage} onChange={(e) => setEditingLead({ ...editingLead, stage: e.target.value as Stage })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20">
                  {stages.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={cancelForm} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancelar</button>
              <button onClick={saveLead} disabled={!editingLead.name.trim()}
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

export default Leads;
