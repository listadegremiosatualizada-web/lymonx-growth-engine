import { useState } from "react";
import { Workflow, Plus, Play, Pause, Edit2, X, Check, Clock, CalendarIcon, MessageCircle, Zap, Users, HeadphonesIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Rule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  agent: string;
  active: boolean;
  runs: number;
}

interface FollowUp {
  id: string;
  name: string;
  delayHours: number;
  message: string;
  active: boolean;
  sends: number;
}

interface Schedule {
  id: string;
  name: string;
  date: Date | undefined;
  time: string;
  message: string;
  autoConfirm: boolean;
  active: boolean;
}

const triggerIcons: Record<string, typeof Zap> = {
  "Nova mensagem": MessageCircle,
  "Lead qualificado": Zap,
  "Cliente existente": Users,
};

const defaultRules: Rule[] = [
  { id: "1", name: "Acionar SDR", trigger: "Nova mensagem", action: "Encaminhar para agente", agent: "SDR Inteligente", active: true, runs: 3420 },
  { id: "2", name: "Acionar Vendas", trigger: "Lead qualificado", action: "Encaminhar para agente", agent: "Consultor de Vendas", active: true, runs: 1856 },
  { id: "3", name: "Acionar Suporte", trigger: "Cliente existente", action: "Encaminhar para agente", agent: "Suporte Técnico", active: true, runs: 987 },
];

const defaultFollowUps: FollowUp[] = [
  { id: "1", name: "Follow-up 1h", delayHours: 1, message: "Olá! Vi que você entrou em contato conosco. Posso ajudar com algo?", active: true, sends: 2340 },
  { id: "2", name: "Follow-up 24h", delayHours: 24, message: "Oi! Passando para saber se ainda precisa de ajuda. Estamos à disposição! 😊", active: true, sends: 1543 },
  { id: "3", name: "Follow-up 72h", delayHours: 72, message: "Olá! Notamos que não tivemos retorno. Gostaria de agendar uma conversa rápida?", active: false, sends: 876 },
];

const defaultSchedules: Schedule[] = [
  { id: "1", name: "Reunião de demonstração", date: new Date(2026, 3, 2, 10, 0), time: "10:00", message: "Sua demonstração está confirmada para {data} às {hora}. Até lá!", autoConfirm: true, active: true },
  { id: "2", name: "Callback comercial", date: new Date(2026, 3, 3, 14, 0), time: "14:00", message: "Ligamos para você em {data} às {hora}. Pode confirmar?", autoConfirm: false, active: true },
];

const Automacoes = () => {
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [followUps, setFollowUps] = useState<FollowUp[]>(defaultFollowUps);
  const [schedules, setSchedules] = useState<Schedule[]>(defaultSchedules);
  const [tab, setTab] = useState<"rules" | "followups" | "schedules">("rules");

  const [editFollowUp, setEditFollowUp] = useState<FollowUp | null>(null);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);

  const toggleRule = (id: string) => setRules(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  const toggleFollowUp = (id: string) => setFollowUps(followUps.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  const toggleSchedule = (id: string) => setSchedules(schedules.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  const saveFollowUp = () => {
    if (!editFollowUp) return;
    const exists = followUps.find((f) => f.id === editFollowUp.id);
    if (exists) setFollowUps(followUps.map((f) => (f.id === editFollowUp.id ? editFollowUp : f)));
    else setFollowUps([...followUps, editFollowUp]);
    setEditFollowUp(null);
  };

  const saveSchedule = () => {
    if (!editSchedule) return;
    const exists = schedules.find((s) => s.id === editSchedule.id);
    if (exists) setSchedules(schedules.map((s) => (s.id === editSchedule.id ? editSchedule : s)));
    else setSchedules([...schedules, editSchedule]);
    setEditSchedule(null);
  };

  const tabs = [
    { key: "rules" as const, label: "Regras", icon: Zap, count: rules.length },
    { key: "followups" as const, label: "Follow-ups", icon: Clock, count: followUps.length },
    { key: "schedules" as const, label: "Agendamentos", icon: CalendarIcon, count: schedules.length },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-fg">Automações</h1>
          <p className="text-sm text-dash-muted mt-1">Configure regras, follow-ups e agendamentos automáticos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t.key ? "bg-white text-dash-fg shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            <span className="text-[10px] font-semibold bg-gray-200/70 text-gray-600 px-1.5 py-0.5 rounded-md">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Rules */}
      {tab === "rules" && (
        <div className="space-y-3">
          {rules.map((rule) => {
            const TriggerIcon = triggerIcons[rule.trigger] || Zap;
            return (
              <div key={rule.id} className="dash-card p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <TriggerIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-dash-fg">{rule.name}</h3>
                  <p className="text-xs text-dash-muted mt-0.5">
                    Quando: <span className="font-medium text-gray-600">{rule.trigger}</span> → Agente: <span className="font-medium text-gray-600">{rule.agent}</span>
                  </p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-xs text-dash-muted">{rule.runs.toLocaleString()} execuções</p>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${rule.active ? "bg-primary" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${rule.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Follow-ups */}
      {tab === "followups" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setEditFollowUp({ id: Date.now().toString(), name: "", delayHours: 1, message: "", active: true, sends: 0 })}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition"
            >
              <Plus className="w-4 h-4" /> Novo Follow-up
            </button>
          </div>

          {followUps.map((fu) => (
            <div key={fu.id} className="dash-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-dash-fg">{fu.name}</h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                      Após {fu.delayHours}h
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{fu.message}</p>
                  <p className="text-[11px] text-dash-muted mt-2">{fu.sends.toLocaleString()} envios</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditFollowUp({ ...fu })} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFollowUp(fu.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${fu.active ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${fu.active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedules */}
      {tab === "schedules" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setEditSchedule({ id: Date.now().toString(), name: "", date: undefined, time: "10:00", message: "", autoConfirm: true, active: true })}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:brightness-110 transition"
            >
              <Plus className="w-4 h-4" /> Novo Agendamento
            </button>
          </div>

          {schedules.map((sch) => (
            <div key={sch.id} className="dash-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-dash-fg mb-1">{sch.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-dash-muted mb-1">
                    <span>{sch.date ? format(sch.date, "dd/MM/yyyy") : "Sem data"}</span>
                    <span>às {sch.time}</span>
                    {sch.autoConfirm && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                        Confirmação automática
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{sch.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditSchedule({ ...sch })} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSchedule(sch.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${sch.active ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sch.active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Follow-up modal */}
      {editFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dash-fg">
                {followUps.find((f) => f.id === editFollowUp.id) ? "Editar Follow-up" : "Novo Follow-up"}
              </h3>
              <button onClick={() => setEditFollowUp(null)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Nome</label>
                <input value={editFollowUp.name} onChange={(e) => setEditFollowUp({ ...editFollowUp, name: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Ex: Follow-up 24h" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Enviar após (horas)</label>
                <input type="number" min={1} value={editFollowUp.delayHours} onChange={(e) => setEditFollowUp({ ...editFollowUp, delayHours: parseInt(e.target.value) || 1 })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Mensagem</label>
                <textarea value={editFollowUp.message} onChange={(e) => setEditFollowUp({ ...editFollowUp, message: e.target.value })} rows={4}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none" placeholder="Mensagem do follow-up..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditFollowUp(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancelar</button>
              <button onClick={saveFollowUp} disabled={!editFollowUp.name.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:brightness-110 transition disabled:opacity-40">
                <Check className="w-4 h-4" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule modal */}
      {editSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-dash-fg">
                {schedules.find((s) => s.id === editSchedule.id) ? "Editar Agendamento" : "Novo Agendamento"}
              </h3>
              <button onClick={() => setEditSchedule(null)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Nome</label>
                <input value={editSchedule.name} onChange={(e) => setEditSchedule({ ...editSchedule, name: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400" placeholder="Ex: Reunião de demonstração" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl text-left flex items-center justify-between",
                      !editSchedule.date && "text-gray-400"
                    )}>
                      {editSchedule.date ? format(editSchedule.date, "dd/MM/yyyy") : "Selecionar data"}
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editSchedule.date}
                      onSelect={(d) => setEditSchedule({ ...editSchedule, date: d })}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Horário</label>
                <input type="time" value={editSchedule.time} onChange={(e) => setEditSchedule({ ...editSchedule, time: e.target.value })}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1 block">Mensagem de confirmação</label>
                <textarea value={editSchedule.message} onChange={(e) => setEditSchedule({ ...editSchedule, message: e.target.value })} rows={3}
                  className="w-full py-2.5 px-3 text-sm bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 resize-none"
                  placeholder="Use {data} e {hora} como variáveis" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editSchedule.autoConfirm} onChange={(e) => setEditSchedule({ ...editSchedule, autoConfirm: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm text-dash-fg">Confirmação automática</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditSchedule(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancelar</button>
              <button onClick={saveSchedule} disabled={!editSchedule.name.trim()}
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
