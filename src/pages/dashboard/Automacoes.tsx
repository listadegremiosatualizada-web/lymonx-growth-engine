import { useState, useEffect } from "react";
import { Plus, Edit2, X, Check, Clock, CalendarIcon, MessageCircle, Zap, Users, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Automation {
  id: string;
  name: string;
  type: "rule" | "followup" | "schedule";
  trigger_event: string;
  action: string;
  agent_name: string;
  delay_hours: number;
  message: string;
  schedule_date: Date | undefined;
  schedule_time: string;
  auto_confirm: boolean;
  is_active: boolean;
  runs: number;
}

const triggerIcons: Record<string, typeof Zap> = {
  "Nova mensagem": MessageCircle,
  "Lead qualificado": Zap,
  "Cliente existente": Users,
};

const Automacoes = () => {
  const { user } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"rules" | "followups" | "schedules">("rules");
  const [editItem, setEditItem] = useState<Automation | null>(null);

  const fetchAutomations = async () => {
    if (!user) return;
    const { data } = await supabase.from("automations").select("*").order("created_at", { ascending: true });
    if (data) {
      setAutomations(data.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type as "rule" | "followup" | "schedule",
        trigger_event: a.trigger_event || "",
        action: a.action || "",
        agent_name: a.agent_name || "",
        delay_hours: a.delay_hours ?? 1,
        message: a.message || "",
        schedule_date: a.schedule_date ? new Date(a.schedule_date) : undefined,
        schedule_time: a.schedule_time || "10:00",
        auto_confirm: a.auto_confirm ?? false,
        is_active: a.is_active ?? true,
        runs: a.runs ?? 0,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchAutomations(); }, [user]);

  const rules = automations.filter((a) => a.type === "rule");
  const followUps = automations.filter((a) => a.type === "followup");
  const schedules = automations.filter((a) => a.type === "schedule");

  const toggleActive = async (id: string) => {
    const item = automations.find((a) => a.id === id);
    if (!item) return;
    const newActive = !item.is_active;
    setAutomations(automations.map((a) => (a.id === id ? { ...a, is_active: newActive } : a)));
    await supabase.from("automations").update({ is_active: newActive }).eq("id", id);
  };

  const saveItem = async () => {
    if (!editItem || !editItem.name.trim() || !user) return;
    const payload = {
      name: editItem.name,
      type: editItem.type,
      trigger_event: editItem.trigger_event,
      action: editItem.action,
      agent_name: editItem.agent_name,
      delay_hours: editItem.delay_hours,
      message: editItem.message,
      schedule_date: editItem.schedule_date?.toISOString() || null,
      schedule_time: editItem.schedule_time,
      auto_confirm: editItem.auto_confirm,
      is_active: editItem.is_active,
    };
    if (editItem.id) {
      await supabase.from("automations").update(payload).eq("id", editItem.id);
    } else {
      await supabase.from("automations").insert({ ...payload, user_id: user.id });
    }
    setEditItem(null);
    fetchAutomations();
  };

  const newItem = (type: "followup" | "schedule") => {
    setEditItem({
      id: "", name: "", type, trigger_event: "", action: "", agent_name: "",
      delay_hours: 1, message: "", schedule_date: undefined, schedule_time: "10:00",
      auto_confirm: true, is_active: true, runs: 0,
    });
  };

  const tabs = [
    { key: "rules" as const, label: "Regras", icon: Zap, count: rules.length },
    { key: "followups" as const, label: "Follow-ups", icon: Clock, count: followUps.length },
    { key: "schedules" as const, label: "Agendamentos", icon: CalendarIcon, count: schedules.length },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-dash-fg">Automações</h1>
        <p className="text-sm text-dash-muted mt-1">Configure regras, follow-ups e agendamentos automáticos</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t.key ? "bg-white text-dash-fg shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
            <span className="text-[10px] font-semibold bg-gray-200/70 text-gray-600 px-1.5 py-0.5 rounded-md">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "rules" && (
        <div className="space-y-3">
          {rules.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Nenhuma regra cadastrada</p>}
          {rules.map((rule) => {
            const TriggerIcon = triggerIcons[rule.trigger_event] || Zap;
            return (
              <div key={rule.id} className="dash-card p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <TriggerIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-dash-fg">{rule.name}</h3>
                  <p className="text-xs text-dash-muted mt-0.5">
                    Quando: <span className="font-medium text-gray-600">{rule.trigger_event}</span> → Agente: <span className="font-medium text-gray-600">{rule.agent_name}</span>
                  </p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-xs text-dash-muted">{rule.runs.toLocaleString()} execuções</p>
                </div>
                <button onClick={() => toggleActive(rule.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${rule.is_active ? "bg-primary" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${rule.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "followups" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={() => newItem("followup")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition">
              <Plus className="w-4 h-4" /> Novo Follow-up
            </button>
          </div>
          {followUps.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Nenhum follow-up cadastrado</p>}
          {followUps.map((fu) => (
            <div key={fu.id} className="dash-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-dash-fg">{fu.name}</h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Após {fu.delay_hours}h</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{fu.message}</p>
                  <p className="text-[11px] text-dash-muted mt-2">{fu.runs.toLocaleString()} envios</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditItem({ ...fu })} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => toggleActive(fu.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${fu.is_active ? "bg-primary" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${fu.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "schedules" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={() => newItem("schedule")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition">
              <Plus className="w-4 h-4" /> Novo Agendamento
            </button>
          </div>
          {schedules.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Nenhum agendamento cadastrado</p>}
          {schedules.map((sch) => (
            <div key={sch.id} className="dash-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-dash-fg mb-1">{sch.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-dash-muted mb-1">
                    <span>{sch.schedule_date ? format(sch.schedule_date, "dd/MM/yyyy") : "Sem data"}</span>
                    <span>às {sch.schedule_time}</span>
                    {sch.auto_confirm && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Confirmação automática</span>}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{sch.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditItem({ ...sch })} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => toggleActive(sch.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${sch.is_active ? "bg-primary" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sch.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dash-fg">
                {editItem.id ? "Editar" : "Novo"} {editItem.type === "followup" ? "Follow-up" : "Agendamento"}
              </h3>
              <button onClick={() => setEditItem(null)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Nome</label>
                <input value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Nome" />
              </div>
              {editItem.type === "followup" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-dash-muted mb-1 block">Enviar após (horas)</label>
                    <input type="number" min={1} value={editItem.delay_hours} onChange={(e) => setEditItem({ ...editItem, delay_hours: parseInt(e.target.value) || 1 })}
                      className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dash-muted mb-1 block">Mensagem</label>
                    <textarea value={editItem.message} onChange={(e) => setEditItem({ ...editItem, message: e.target.value })} rows={4}
                      className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none" placeholder="Mensagem do follow-up..." />
                  </div>
                </>
              )}
              {editItem.type === "schedule" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-dash-muted mb-1 block">Data</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className={cn("w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl text-left flex items-center justify-between", !editItem.schedule_date && "text-gray-400")}>
                          {editItem.schedule_date ? format(editItem.schedule_date, "dd/MM/yyyy") : "Selecionar data"}
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={editItem.schedule_date} onSelect={(d) => setEditItem({ ...editItem, schedule_date: d })} initialFocus className={cn("p-3 pointer-events-auto")} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dash-muted mb-1 block">Horário</label>
                    <input type="time" value={editItem.schedule_time} onChange={(e) => setEditItem({ ...editItem, schedule_time: e.target.value })}
                      className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dash-muted mb-1 block">Mensagem de confirmação</label>
                    <textarea value={editItem.message} onChange={(e) => setEditItem({ ...editItem, message: e.target.value })} rows={3}
                      className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none" placeholder="Use {data} e {hora}" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editItem.auto_confirm} onChange={(e) => setEditItem({ ...editItem, auto_confirm: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                    <span className="text-sm text-dash-fg">Confirmação automática</span>
                  </label>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancelar</button>
              <button onClick={saveItem} disabled={!editItem.name.trim()}
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

export default Automacoes;
