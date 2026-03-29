import { useState, useEffect } from "react";
import { TrendingUp, MessageCircle, Users, DollarSign, Clock, Target, Headphones, CalendarIcon, ArrowUpRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const channelColors: Record<string, string> = {
  WhatsApp: "#10b981", Site: "#6366f1", Instagram: "#f59e0b", Campanha: "#8b5cf6", Indicação: "#06b6d4",
};

const DashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ leads: 0, contacts: 0, agents: 0, automations: 0 });
  const [channelData, setChannelData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [stageData, setStageData] = useState<{ stage: string; count: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [leadsRes, contactsRes, agentsRes, autoRes] = await Promise.all([
        supabase.from("leads").select("*"),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
        supabase.from("agents").select("id", { count: "exact", head: true }),
        supabase.from("automations").select("id", { count: "exact", head: true }),
      ]);

      const leads = leadsRes.data || [];
      setStats({
        leads: leads.length,
        contacts: contactsRes.count ?? 0,
        agents: agentsRes.count ?? 0,
        automations: autoRes.count ?? 0,
      });

      // Channel breakdown
      const originMap: Record<string, number> = {};
      leads.forEach((l) => { const o = l.origin || "Outro"; originMap[o] = (originMap[o] || 0) + 1; });
      setChannelData(Object.entries(originMap).map(([name, value]) => ({
        name, value, color: channelColors[name] || "#94a3b8",
      })));

      // Stage breakdown
      const stageMap: Record<string, number> = {};
      leads.forEach((l) => { const s = l.stage || "novo"; stageMap[s] = (stageMap[s] || 0) + 1; });
      setStageData(Object.entries(stageMap).map(([stage, count]) => ({ stage, count })));

      setLoading(false);
    };
    fetchAll();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  const cards = [
    { label: "Total de Leads", value: stats.leads.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Conversas", value: stats.contacts.toLocaleString(), icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Agentes Ativos", value: stats.agents.toLocaleString(), icon: Headphones, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Automações", value: stats.automations.toLocaleString(), icon: Target, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const stageLabels: Record<string, string> = {
    novo: "Novo", qualificando: "Qualificando", proposta: "Proposta", fechado: "Fechado", perdido: "Perdido",
  };
  const stageColors: Record<string, string> = {
    novo: "#3b82f6", qualificando: "#f59e0b", proposta: "#8b5cf6", fechado: "#10b981", perdido: "#ef4444",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-dash-fg">Dashboard</h1>
        <p className="text-sm text-dash-muted mt-1">Visão geral do seu atendimento</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="dash-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <span className="text-sm text-dash-muted">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-dash-fg">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 dash-card p-5">
          <h2 className="text-base font-semibold text-dash-fg mb-4">Funil de Leads</h2>
          {stageData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => stageLabels[v] || v} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, background: "#fff" }}
                    labelFormatter={(v) => stageLabels[v] || v} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Leads">
                    {stageData.map((entry) => (
                      <Cell key={entry.stage} fill={stageColors[entry.stage] || "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">Adicione leads para ver o funil</p>
          )}
        </div>

        <div className="dash-card p-5">
          <h2 className="text-base font-semibold text-dash-fg mb-4">Canal de Origem</h2>
          {channelData.length > 0 ? (
            <>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {channelData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {channelData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-dash-muted">{c.name}</span>
                    </div>
                    <span className="font-medium text-dash-fg">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">Sem dados</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
