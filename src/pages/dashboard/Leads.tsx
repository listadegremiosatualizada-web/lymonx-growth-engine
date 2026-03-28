import { useState } from "react";
import { Plus, GripVertical, Phone, Globe, Edit2, X, Check } from "lucide-react";

type Stage = "novo" | "qualificando" | "proposta" | "fechado" | "perdido";

interface Lead {
  id: string;
  name: string;
  phone: string;
  origin: string;
  stage: Stage;
  value?: string;
}

const stages: { key: Stage; label: string; color: string; dot: string }[] = [
  { key: "novo", label: "Novo Lead", color: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  { key: "qualificando", label: "Qualificando", color: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  { key: "proposta", label: "Proposta", color: "bg-violet-50 border-violet-200", dot: "bg-violet-500" },
  { key: "fechado", label: "Fechado", color: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  { key: "perdido", label: "Perdido", color: "bg-red-50 border-red-200", dot: "bg-red-400" },
];

const initialLeads: Lead[] = [
  { id: "1", name: "Ana Silva", phone: "(11) 99999-1234", origin: "WhatsApp", stage: "novo", value: "R$ 2.500" },
  { id: "2", name: "Carlos Santos", phone: "(11) 98888-5678", origin: "Site", stage: "novo", value: "R$ 5.000" },
  { id: "3", name: "Maria Oliveira", phone: "(21) 97777-9012", origin: "Instagram", stage: "qualificando", value: "R$ 8.900" },
  { id: "4", name: "João Mendes", phone: "(11) 96666-3456", origin: "WhatsApp", stage: "qualificando", value: "R$ 3.200" },
  { id: "5", name: "Fernanda Lima", phone: "(31) 95555-7890", origin: "Indicação", stage: "proposta", value: "R$ 15.000" },
  { id: "6", name: "Ricardo Alves", phone: "(11) 94444-1234", origin: "Site", stage: "proposta", value: "R$ 12.300" },
  { id: "7", name: "Patrícia Costa", phone: "(21) 93333-5678", origin: "WhatsApp", stage: "fechado", value: "R$ 7.800" },
  { id: "8", name: "Bruno Souza", phone: "(11) 92222-9012", origin: "Instagram", stage: "perdido", value: "R$ 4.500" },
];

const emptyLead = (): Lead => ({
  id: Date.now().toString(),
  name: "",
  phone: "",
  origin: "WhatsApp",
  stage: "novo",
  value: "",
});

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragEnd = () => { setDraggedId(null); setDragOverStage(null); };

  const handleDragOver = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDrop = (stage: Stage) => {
    if (!draggedId) return;
    setLeads(leads.map((l) => (l.id === draggedId ? { ...l, stage } : l)));
    setDraggedId(null);
    setDragOverStage(null);
  };

  const openNewLead = () => {
    setEditingLead(emptyLead());
    setShowForm(true);
  };

  const openEditLead = (lead: Lead) => {
    setEditingLead({ ...lead });
    setShowForm(true);
  };

  const saveLead = () => {
    if (!editingLead || !editingLead.name.trim()) return;
    const exists = leads.find((l) => l.id === editingLead.id);
    if (exists) {
      setLeads(leads.map((l) => (l.id === editingLead.id ? editingLead : l)));
    } else {
      setLeads([...leads, editingLead]);
    }
    setShowForm(false);
    setEditingLead(null);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  const getLeadsByStage = (stage: Stage) => leads.filter((l) => l.stage === stage);

  const totalValue = (stage: Stage) => {
    const total = getLeadsByStage(stage).reduce((sum, l) => {
      const num = parseFloat((l.value || "0").replace(/[^\d,]/g, "").replace(",", "."));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="space-y-5 max-w-full mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-fg">Leads (CRM)</h1>
          <p className="text-sm text-dash-muted mt-1">Arraste os cards entre as colunas para atualizar o status</p>
        </div>
        <button
          onClick={openNewLead}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 12rem)" }}>
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.key);
          const isOver = dragOverStage === stage.key;
          return (
            <div
              key={stage.key}
              className={`flex-1 min-w-[240px] max-w-[280px] flex flex-col rounded-2xl border transition-all duration-200 ${stage.color} ${
                isOver ? "ring-2 ring-primary/30 scale-[1.01]" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={() => handleDrop(stage.key)}
            >
              {/* Column header */}
              <div className="px-4 py-3 border-b border-black/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.dot}`} />
                    <span className="text-sm font-semibold text-dash-fg">{stage.label}</span>
                    <span className="text-[11px] font-medium text-dash-muted bg-white/70 px-1.5 py-0.5 rounded-md">
                      {stageLeads.length}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-dash-muted mt-1">{totalValue(stage.key)}</p>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-auto">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 group ${
                      draggedId === lead.id ? "opacity-40 scale-95" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span className="text-sm font-medium text-dash-fg">{lead.name}</span>
                      </div>
                      <button
                        onClick={() => openEditLead(lead)}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-1 text-[11px] text-dash-muted">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        <span>{lead.origin}</span>
                      </div>
                    </div>
                    {lead.value && (
                      <div className="mt-2 text-xs font-semibold text-primary">{lead.value}</div>
                    )}
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    Arraste um lead aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal form */}
      {showForm && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dash-fg">
                {leads.find((l) => l.id === editingLead.id) ? "Editar Lead" : "Novo Lead"}
              </h3>
              <button onClick={cancelForm} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Nome *</label>
                <input
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                  placeholder="Nome do lead"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Telefone</label>
                <input
                  value={editingLead.phone}
                  onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Origem</label>
                <select
                  value={editingLead.origin}
                  onChange={(e) => setEditingLead({ ...editingLead, origin: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>WhatsApp</option>
                  <option>Site</option>
                  <option>Instagram</option>
                  <option>Indicação</option>
                  <option>Facebook</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Valor</label>
                <input
                  value={editingLead.value || ""}
                  onChange={(e) => setEditingLead({ ...editingLead, value: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Etapa</label>
                <select
                  value={editingLead.stage}
                  onChange={(e) => setEditingLead({ ...editingLead, stage: e.target.value as Stage })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {stages.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={cancelForm} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">
                Cancelar
              </button>
              <button
                onClick={saveLead}
                disabled={!editingLead.name.trim()}
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

export default Leads;
